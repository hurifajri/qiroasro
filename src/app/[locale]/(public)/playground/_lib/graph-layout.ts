import type { Edge, Node } from '@xyflow/react';
import type { HierarchyDirection } from '../_schemas/graph';
import { getNodeHeight, getNodeWidth } from './node';

interface HierarchicalLayoutOptions {
  direction: HierarchyDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
}

/**
 * Apply hierarchical layout to nodes
 * Places nodes in layers based on their longest path from a root node
 */
export function applyHierarchicalLayout(
  nodes: Node[],
  edges: Edge[],
  options: HierarchicalLayoutOptions,
): Node[] {
  const { direction, nodeSpacing = 80, layerSpacing = 150 } = options;

  // Step 1: Build adjacency maps
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();

  for (const edge of edges) {
    const sourceChildren = children.get(edge.source) ?? [];
    const targetParents = parents.get(edge.target) ?? [];
    sourceChildren.push(edge.target);
    targetParents.push(edge.source);
    children.set(edge.source, sourceChildren);
    parents.set(edge.target, targetParents);
  }

  // Step 2: Assign layers by longest path (Kahn's algorithm) so every node
  // sits after all of its parents, e.g. waw -> waw-maddiyyah -> makhraj.
  const layers = new Map<string, number>();
  const inDegree = new Map<string, number>();
  const queue: string[] = [];

  for (const node of nodes) {
    const parentCount = parents.get(node.id)?.length ?? 0;
    layers.set(node.id, 0);
    inDegree.set(node.id, parentCount);
    if (parentCount === 0) {
      queue.push(node.id);
    }
  }

  for (let index = 0; index < queue.length; index++) {
    const id = queue[index];
    const layer = layers.get(id) ?? 0;

    for (const childId of children.get(id) ?? []) {
      layers.set(childId, Math.max(layers.get(childId) ?? 0, layer + 1));

      const remainingParents = (inDegree.get(childId) ?? 0) - 1;
      inDegree.set(childId, remainingParents);
      if (remainingParents === 0) {
        queue.push(childId);
      }
    }
  }

  // Step 3: Group nodes by layer
  const nodesByLayer = new Map<number, Node[]>();
  for (const node of nodes) {
    const layer = layers.get(node.id) ?? 0;
    if (!nodesByLayer.has(layer)) {
      nodesByLayer.set(layer, []);
    }
    const layerNodes = nodesByLayer.get(layer) ?? [];
    layerNodes.push(node);
    nodesByLayer.set(layer, layerNodes);
  }

  // Step 4: Position nodes
  const layoutedNodes: Node[] = [];
  const isVertical = direction === 'vertical';

  for (const [layer, layerNodes] of nodesByLayer) {
    // Calculate total width/height of this layer
    const totalSize = layerNodes.reduce(
      (sum, n) => sum + getNodeWidth(n.type) + nodeSpacing,
      -nodeSpacing,
    );
    let offset = -totalSize / 2;

    for (const node of layerNodes) {
      const nodeWidth = getNodeWidth(node.type);
      const nodeHeight = getNodeHeight(node.type);

      let x: number;
      let y: number;

      if (isVertical) {
        // Vertical: layers go top to bottom, nodes spread horizontally
        x = offset + nodeWidth / 2;
        y = layer * layerSpacing;
      } else {
        // Horizontal: layers go left to right, nodes spread vertically
        x = layer * layerSpacing;
        y = offset + nodeHeight / 2;
      }

      layoutedNodes.push({
        ...node,
        position: { x, y },
      });

      offset += (isVertical ? nodeWidth : nodeHeight) + nodeSpacing;
    }
  }

  return layoutedNodes;
}

/**
 * Apply radial layout to nodes
 * Places nodes in concentric circles based on their type
 */
export function applyRadialLayout(
  nodes: Node[],
  centerX: number,
  centerY: number,
  scale = 1,
): Node[] {
  // Group nodes by type
  const nodesByType = new Map<string, Node[]>();
  for (const node of nodes) {
    const type = node.type || 'default';
    if (!nodesByType.has(type)) {
      nodesByType.set(type, []);
    }
    nodesByType.get(type)?.push(node);
  }

  // Define ring radii for each type (inner to outer)
  const ringConfig: Record<string, number> = {
    letter: 550,
    articulationPoint: 750,
    articulationArea: 850,
    trait: 700,
    traitGroup: 800,
  };

  const layoutedNodes: Node[] = [];

  for (const [type, typeNodes] of nodesByType) {
    const radius = (ringConfig[type] || 300) * scale;
    typeNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / typeNodes.length - Math.PI / 2;
      layoutedNodes.push({
        ...node,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        },
      });
    });
  }

  return layoutedNodes;
}
