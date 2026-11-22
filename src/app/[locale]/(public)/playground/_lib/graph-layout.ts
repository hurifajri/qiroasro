import type { Node } from '@xyflow/react';

import type { HierarchyDirection, ViewMode } from '../_schemas/graph';
import { getNodeHeight, getNodeWidth } from './node';

interface HierarchicalLayoutOptions {
  direction: HierarchyDirection;
  nodeSpacing?: number;
  layerSpacing?: number;
}

function getParentLetterSlug(node: Node): string | null {
  if (node.type !== 'letter') return null;
  const parentSlug = node.data.parentLetterSlug;
  return typeof parentSlug === 'string' && parentSlug.length > 0
    ? parentSlug
    : null;
}

function getNodeSlug(node: Node): string | null {
  const slug = node.data.slug;
  return typeof slug === 'string' && slug.length > 0 ? slug : null;
}

function getHierarchicalLayer(node: Node, hasChildLetters: boolean): number {
  const detailLayer = hasChildLetters ? 2 : 1;

  switch (node.type) {
    case 'letter':
      return getParentLetterSlug(node) !== null ? 1 : 0;
    case 'trait':
    case 'articulationPoint':
      return detailLayer;
    case 'traitGroup':
    case 'articulationArea':
      return detailLayer + 1;
    case undefined:
    default:
      return 0;
  }
}

/**
 * Apply hierarchical layout to nodes
 * Places nodes in layers:
 * parent letter -> child letter (when present) -> trait & articulation point -> trait group & articulation area
 */
export function applyHierarchicalLayout(
  nodes: Node[],
  options: HierarchicalLayoutOptions,
): Node[] {
  const { direction, nodeSpacing = 80, layerSpacing = 150 } = options;
  const hasChildLetters = nodes.some(
    (node) => getParentLetterSlug(node) !== null,
  );

  // Group nodes by semantic hierarchy layer
  const nodesByLayer = new Map<number, Node[]>();
  for (const node of nodes) {
    const layer = getHierarchicalLayer(node, hasChildLetters);
    const layerNodes = nodesByLayer.get(layer) ?? [];
    layerNodes.push(node);
    nodesByLayer.set(layer, layerNodes);
  }

  // Position nodes centered along the cross axis
  const layoutedNodes: Node[] = [];
  const isVertical = direction === 'vertical';

  for (const [layer, layerNodes] of nodesByLayer) {
    const totalSize = layerNodes.reduce(
      (sum, n) =>
        sum +
        (isVertical ? getNodeWidth(n.type) : getNodeHeight(n.type)) +
        nodeSpacing,
      -nodeSpacing,
    );
    let offset = -totalSize / 2;

    for (const node of layerNodes) {
      const nodeWidth = getNodeWidth(node.type);
      const nodeHeight = getNodeHeight(node.type);

      const x = isVertical ? offset : layer * layerSpacing - nodeWidth / 2;
      const y = isVertical ? layer * layerSpacing - nodeHeight / 2 : offset;

      layoutedNodes.push({
        ...node,
        position: { x, y },
      });

      offset += (isVertical ? nodeWidth : nodeHeight) + nodeSpacing;
    }
  }

  return layoutedNodes;
}

interface RadialLayoutOptions {
  viewMode?: ViewMode;
  scale?: number;
}

type RadialRing = 'letterChild' | 'letter' | 'detail' | 'group';

// Ring radii (inner to outer) for full graph view:
// letter child -> letter parent -> articulation point + trait -> trait group + articulation area
const ALL_VIEW_RADIAL_RADIUS: Record<RadialRing, number> = {
  letterChild: 370,
  letter: 490,
  detail: 630,
  group: 760,
};

// Ring radii (inner to outer) for single-letter view:
// letter (center) -> articulation point + trait -> trait group + articulation area
const LETTER_VIEW_RADIAL_RADIUS: Record<RadialRing, number> = {
  letterChild: 0,
  letter: 0,
  detail: 260,
  group: 460,
};

// Ring radii when single-letter view includes child variants (e.g., waw/ya):
// parent letter (center) -> child variants -> articulation point + trait -> trait group + articulation area
const LETTER_VIEW_WITH_CHILDREN_RADIAL_RADIUS: Record<RadialRing, number> = {
  letterChild: 150,
  letter: 0,
  detail: 360,
  group: 560,
};

const CHILD_LETTER_ARC_SPACING = getNodeWidth('letter') + 10;

function getRadialRingRadii(
  viewMode: ViewMode,
  hasChildLetters: boolean,
): Record<RadialRing, number> {
  if (viewMode === 'letter') {
    return hasChildLetters
      ? LETTER_VIEW_WITH_CHILDREN_RADIAL_RADIUS
      : LETTER_VIEW_RADIAL_RADIUS;
  }

  return ALL_VIEW_RADIAL_RADIUS;
}

function getRadialRing(node: Node): RadialRing {
  switch (node.type) {
    case 'letter':
      return getParentLetterSlug(node) !== null ? 'letterChild' : 'letter';
    case 'articulationPoint':
    case 'trait':
      return 'detail';
    case 'articulationArea':
    case 'traitGroup':
      return 'group';
    case undefined:
    default:
      return 'letter';
  }
}

function placeOnRing(
  node: Node,
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
): Node {
  return {
    ...node,
    position: {
      x: centerX + radius * Math.cos(angle) - getNodeWidth(node.type) / 2,
      y: centerY + radius * Math.sin(angle) - getNodeHeight(node.type) / 2,
    },
  };
}

interface ChildPlacement {
  node: Node;
  angle: number;
}

interface AngleCluster {
  items: ChildPlacement[];
  sumAngle: number;
  centerAngle: number;
}

/**
 * Resolves angular overlaps between child letter nodes on the inner circle
 * while keeping each group centered as close as possible to its parent angle.
 */
function resolveChildAngles(
  placements: ChildPlacement[],
  minAngleStep: number,
): ChildPlacement[] {
  const sorted = [...placements].sort((a, b) => a.angle - b.angle);
  const clusters: AngleCluster[] = [];

  for (const item of sorted) {
    clusters.push({
      items: [item],
      sumAngle: item.angle,
      centerAngle: item.angle,
    });

    while (clusters.length >= 2) {
      const prev = clusters.at(-2);
      const curr = clusters.at(-1);
      if (!prev || !curr) {
        break;
      }

      const prevRight =
        prev.centerAngle + ((prev.items.length - 1) / 2) * minAngleStep;
      const currLeft =
        curr.centerAngle - ((curr.items.length - 1) / 2) * minAngleStep;

      if (currLeft - prevRight >= minAngleStep - 1e-6) {
        break;
      }

      const mergedItems = [...prev.items, ...curr.items];
      const mergedSum = prev.sumAngle + curr.sumAngle;
      clusters.splice(-2, 2, {
        items: mergedItems,
        sumAngle: mergedSum,
        centerAngle: mergedSum / mergedItems.length,
      });
    }
  }

  return clusters.flatMap((cluster) =>
    cluster.items.map((item, index) => ({
      node: item.node,
      angle:
        cluster.centerAngle +
        (index - (cluster.items.length - 1) / 2) * minAngleStep,
    })),
  );
}

function layoutChildLetters(
  childLetterNodes: Node[],
  parentLetterAngles: Map<string, number>,
  centerX: number,
  centerY: number,
  innerRadius: number,
): Node[] {
  const minAngleStep =
    innerRadius > 0 ? CHILD_LETTER_ARC_SPACING / innerRadius : 0;
  const childrenByParent = new Map<string, Node[]>();
  const orphanChildren: Node[] = [];

  for (const child of childLetterNodes) {
    const parentSlug = getParentLetterSlug(child);
    if (parentSlug && parentLetterAngles.has(parentSlug)) {
      const siblings = childrenByParent.get(parentSlug) ?? [];
      siblings.push(child);
      childrenByParent.set(parentSlug, siblings);
    } else {
      orphanChildren.push(child);
    }
  }

  const desiredPlacements: ChildPlacement[] = [];
  for (const [parentSlug, siblings] of childrenByParent) {
    const parentAngle = parentLetterAngles.get(parentSlug) ?? -Math.PI / 2;
    siblings.forEach((node, index) => {
      const offset = (index - (siblings.length - 1) / 2) * minAngleStep;
      desiredPlacements.push({
        node,
        angle: parentAngle + offset,
      });
    });
  }

  const resolvedNodes = resolveChildAngles(desiredPlacements, minAngleStep).map(
    ({ node, angle }) =>
      placeOnRing(node, centerX, centerY, innerRadius, angle),
  );

  const orphanNodes = orphanChildren.map((node, index) => {
    const angle = (2 * Math.PI * index) / orphanChildren.length - Math.PI / 2;
    return placeOnRing(node, centerX, centerY, innerRadius, angle);
  });

  return [...resolvedNodes, ...orphanNodes];
}

/**
 * Apply radial layout to nodes.
 * - `all` view: concentric rings (outer to inner) for group -> detail -> letter parent -> letter child.
 * - `letter` view: letter centered at (centerX, centerY) (layer 1), with optional child variants around it,
 *   followed by trait + articulation point (layer 2), and trait group + articulation area (layer 3).
 */
export function applyRadialLayout(
  nodes: Node[],
  centerX: number,
  centerY: number,
  options: RadialLayoutOptions = {},
): Node[] {
  const { viewMode = 'all', scale = 1 } = options;
  const nodesByRing = new Map<Exclude<RadialRing, 'letterChild'>, Node[]>();
  const childLetterNodes: Node[] = [];

  for (const node of nodes) {
    const ring = getRadialRing(node);
    if (ring === 'letterChild') {
      childLetterNodes.push(node);
      continue;
    }

    const group = nodesByRing.get(ring) ?? [];
    group.push(node);
    nodesByRing.set(ring, group);
  }

  const ringRadii = getRadialRingRadii(viewMode, childLetterNodes.length > 0);
  const layoutedNodes: Node[] = [];
  const parentLetterAngles = new Map<string, number>();

  for (const [ring, ringNodes] of nodesByRing) {
    const radius = ringRadii[ring] * scale;

    ringNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / ringNodes.length - Math.PI / 2;
      const slug = ring === 'letter' ? getNodeSlug(node) : null;
      if (slug) {
        parentLetterAngles.set(slug, angle);
      }

      layoutedNodes.push(placeOnRing(node, centerX, centerY, radius, angle));
    });
  }

  if (childLetterNodes.length === 0) {
    return layoutedNodes;
  }

  const innerRadius = ringRadii.letterChild * scale;
  const placedChildren =
    viewMode === 'letter'
      ? childLetterNodes.map((node, index) => {
          const angle = (2 * Math.PI * index) / childLetterNodes.length;
          return placeOnRing(node, centerX, centerY, innerRadius, angle);
        })
      : layoutChildLetters(
          childLetterNodes,
          parentLetterAngles,
          centerX,
          centerY,
          innerRadius,
        );

  return [...layoutedNodes, ...placedChildren];
}
