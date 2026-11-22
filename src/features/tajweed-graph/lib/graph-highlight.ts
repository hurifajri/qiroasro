import type { Edge as FlowEdge, Node as FlowNode } from '@xyflow/react';

import type {
  EdgeStyleOptions,
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '../schemas/graph';
import type { PlaygroundData } from '../schemas/tajweed-graph';
import { generateGraphFromData } from './graph-generator';
import { applyHierarchicalLayout, applyRadialLayout } from './graph-layout';

export type BuildLayoutedGraphOptions = {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedLetterId: number;
  isTraitVisible: boolean;
  isArticulationVisible: boolean;
  isFloating: boolean;
  isInteractive?: boolean;
};

export type ApplyEdgesHighlightOptions = {
  selectedNodeId: string | null;
  connectedEdgeIds: ReadonlySet<string>;
  edgeStyle: EdgeStyleOptions;
};

/** Generates, lays out, and annotates Tajweed graph nodes and edges with handle metadata. */
export function buildLayoutedGraph(
  data: PlaygroundData,
  options: BuildLayoutedGraphOptions,
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const {
    viewMode,
    layoutMode,
    hierarchyDirection,
    selectedLetterId,
    isTraitVisible,
    isArticulationVisible,
    isFloating,
    isInteractive = true,
  } = options;

  const { nodes: rawNodes, edges } = generateGraphFromData(data, {
    viewMode,
    layoutMode,
    hierarchyDirection,
    selectedId: selectedLetterId,
    isTraitVisible,
    isArticulationVisible,
  });

  const layoutedNodes =
    layoutMode === 'radial'
      ? applyRadialLayout(rawNodes, 600, 400, { viewMode })
      : applyHierarchicalLayout(rawNodes, {
          direction: hierarchyDirection,
          nodeSpacing: 30,
          layerSpacing: viewMode === 'letter' ? 200 : 600,
        });

  const nodesWithSourceEdge = new Set(edges.map((edge) => edge.source));
  const nodesWithTargetEdge = new Set(edges.map((edge) => edge.target));

  const nodes = layoutedNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isFloating,
      layoutMode,
      hierarchyDirection,
      hasSourceEdge: nodesWithSourceEdge.has(node.id),
      hasTargetEdge: nodesWithTargetEdge.has(node.id),
      isInteractive,
    },
  }));

  return { nodes, edges };
}

/** Applies highlight/dim state to graph nodes while preserving unchanged object references. */
export function applyNodesHighlight(
  nodes: FlowNode[],
  selectedNodeId: string | null,
  connectedNodeIds: ReadonlySet<string>,
): FlowNode[] {
  return nodes.map((node) => {
    const isSelected = node.id === selectedNodeId;
    const isConnected = connectedNodeIds.has(node.id);
    const shouldHighlight = isSelected || isConnected;
    const shouldDim = selectedNodeId ? !shouldHighlight : false;

    const currentHighlight = node.data?.isHighlighted ?? false;
    const currentDim = node.data?.isDimmed ?? false;
    if (
      currentHighlight === shouldHighlight &&
      currentDim === shouldDim &&
      node.hidden !== true
    ) {
      return node;
    }

    return {
      ...node,
      hidden: false,
      data: {
        ...node.data,
        isHighlighted: shouldHighlight,
        isDimmed: shouldDim,
      },
    };
  });
}

/** Applies highlight/dim and stroke style state to graph edges while preserving unchanged references. */
export function applyEdgesHighlight(
  edges: FlowEdge[],
  options: ApplyEdgesHighlightOptions,
): FlowEdge[] {
  const { selectedNodeId, connectedEdgeIds, edgeStyle } = options;
  const edgeType = edgeStyle.isFloating ? 'floating' : edgeStyle.shape;

  return edges.map((edge) => {
    const isConnected = connectedEdgeIds.has(edge.id);
    const targetStrokeWidth = isConnected ? 3 : 1;
    const targetOpacity = selectedNodeId && !isConnected ? 0.2 : 1;
    const targetAnimated = isConnected ? true : edgeStyle.isAnimated;

    const currentStyle = edge.style as Record<string, unknown> | undefined;
    if (
      edge.hidden !== true &&
      edge.type === edgeType &&
      currentStyle?.strokeWidth === targetStrokeWidth &&
      currentStyle?.opacity === targetOpacity &&
      edge.animated === targetAnimated
    ) {
      return edge;
    }

    return {
      ...edge,
      type: edgeType,
      hidden: false,
      style: {
        ...edge.style,
        strokeWidth: targetStrokeWidth,
        opacity: targetOpacity,
      },
      animated: targetAnimated,
    };
  });
}
