import {
  type Edge,
  type InternalNode,
  type Node,
  Position,
  type XYPosition,
} from '@xyflow/react';
import type { HierarchyDirection } from '../schemas/graph';

interface HierarchicalLayoutOptions {
  direction: HierarchyDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
}

/* ============================================
   Layout
   ============================================ */

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

/**
 * Get estimated node width based on type
 */
function getNodeWidth(nodeType: string | undefined): number {
  switch (nodeType) {
    case 'letter':
      return 96; // size-24 = 96px
    case 'articulationArea':
      return 120;
    case 'articulationPoint':
      return 100;
    case 'traitGroup':
      return 120;
    case 'trait':
      return 100;
    default:
      return 80;
  }
}

/**
 * Get estimated node height based on type
 */
function getNodeHeight(nodeType: string | undefined): number {
  switch (nodeType) {
    case 'letter':
      return 96; // size-24 = 96px
    case 'articulationArea':
      return 48;
    case 'articulationPoint':
      return 36;
    case 'traitGroup':
      return 56;
    case 'trait':
      return 40;
    default:
      return 40;
  }
}

/* ============================================
   Edge
   ============================================ */

interface EdgeParams {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
}

/**
 * Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) needed to create a floating edge.
 * These parameters are dynamically calculated based on the positions of the source and target nodes.
 */
export function getEdgeParams(
  source: InternalNode,
  target: InternalNode,
): EdgeParams {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

/**
 * Get the intersection point of the line between the center of the intersection node
 * and the target node. This determines where the edge should connect to the node.
 */
function getNodeIntersection(
  intersectionNode: InternalNode,
  targetNode: InternalNode,
): XYPosition {
  const { internals: intersectionInternals } = intersectionNode;
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured ?? { width: 0, height: 0 };
  const targetPosition = targetNode.internals.positionAbsolute;

  const offset = 0;
  const w = Math.max(0, (intersectionNodeWidth ?? 0) / 2 - offset);
  const h = Math.max(0, (intersectionNodeHeight ?? 0) / 2 - offset);

  const x2 = intersectionInternals.positionAbsolute.x + w;
  const y2 = intersectionInternals.positionAbsolute.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

/**
 * Returns the position (top, right, bottom, or left) of the node
 * compared to the intersection point
 */
function getEdgePosition(node: Node, intersectionPoint: XYPosition): Position {
  const n = { ...node.position, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (n.measured?.width ?? 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + (n.measured?.height ?? 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}
