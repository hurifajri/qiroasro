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
 * Places nodes in layers based on their connections
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

  // Step 2: Find root nodes (no incoming edges)
  const roots = nodes.filter((n) => {
    const nodeParents = parents.get(n.id);
    return !nodeParents || nodeParents.length === 0;
  });

  // Step 3: Assign layers using BFS
  const layers = new Map<string, number>();
  const queue = [...roots.map((r) => ({ id: r.id, layer: 0 }))];

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) {
      break;
    }
    const { id, layer } = item;
    if (layers.has(id)) {
      continue;
    }
    layers.set(id, layer);

    for (const childId of children.get(id) || []) {
      queue.push({ id: childId, layer: layer + 1 });
    }
  }

  // Handle nodes without connections (assign to layer 0)
  for (const node of nodes) {
    if (!layers.has(node.id)) {
      layers.set(node.id, 0);
    }
  }

  // Step 4: Group nodes by layer
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

  // Step 5: Position nodes
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
    const radius = ringConfig[type] || 300;
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
