import type { Edge, Node } from '@xyflow/react';
import type {
  ArticulationArea,
  ArticulationPoint,
} from '../_schemas/articulation';
import type {
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '../_schemas/graph';
import type {
  Letter,
  LetterArticulation,
  LetterTrait,
} from '../_schemas/letter';
import type { Trait, TraitGroup } from '../_schemas/trait';
import {
  createArticulationAreaNode,
  createArticulationPointNode,
  createLetterNode,
  createTraitGroupNode,
  createTraitNode,
} from './node';

export interface GraphData {
  letters: Letter[];
  letterArticulations: LetterArticulation[];
  letterTraits: LetterTrait[];
  articulationAreas: ArticulationArea[];
  articulationPoints: ArticulationPoint[];
  traits: Trait[];
  traitGroups: TraitGroup[];
}

interface GenerateGraphOptions {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedId: number;
}

interface GraphView {
  nodes: Node[];
  edges: Edge[];
}

export function generateGraphFromData(
  data: GraphData,
  options: GenerateGraphOptions,
): GraphView {
  const { viewMode, selectedId } = options;

  switch (viewMode) {
    case 'all':
      return generateAllView(data);
    case 'articulation':
      return generateByArticulationView(data);
    case 'trait':
      return generateByTraitView(data);
    case 'letter':
      return generateByLetterView(data, selectedId);
    default:
      return { nodes: [], edges: [] };
  }
}

interface GraphBuilder {
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  build: () => GraphView;
}

/** Collects nodes/edges while ignoring duplicates (shared points/traits). */
function createGraphBuilder(): GraphBuilder {
  const nodes = new Map<string, Node>();
  const edges = new Map<string, Edge>();

  return {
    addNode: (node) => {
      if (!nodes.has(node.id)) nodes.set(node.id, node);
    },
    addEdge: (edge) => {
      if (!edges.has(edge.id)) edges.set(edge.id, edge);
    },
    build: () => ({ nodes: [...nodes.values()], edges: [...edges.values()] }),
  };
}

/**
 * Edge between a root letter (waw/ya) and one of its variant child nodes
 * (maddiyyah / ghairu maddiyyah). `flow` follows the direction of the view's
 * hierarchy so the layout keeps a single left-to-right (or top-down) flow.
 */
function createVariantEdge(
  parent: Letter,
  child: Letter,
  flow: 'parent-first' | 'child-first',
): Edge {
  const parentNodeId = `letter-${parent.id}`;
  const childNodeId = `letter-${child.id}`;

  return {
    id: `edge-letter-${parent.id}-variant-${child.id}`,
    source: flow === 'parent-first' ? parentNodeId : childNodeId,
    target: flow === 'parent-first' ? childNodeId : parentNodeId,
    type: 'default',
    style: { stroke: '#F59E0B', strokeWidth: 1.5, strokeDasharray: '6 4' },
  };
}

function getLetterBySlug(letters: Letter[]) {
  return new Map(letters.map((letter) => [letter.slug, letter]));
}

function generateAllView(data: GraphData): GraphView {
  const builder = createGraphBuilder();
  const letterBySlug = getLetterBySlug(data.letters);

  // Add letters (29 root letters + waw/ya variant children) and variant edges
  for (const letter of data.letters) {
    builder.addNode(createLetterNode(letter));

    const parent = letter.parentLetterSlug
      ? letterBySlug.get(letter.parentLetterSlug)
      : undefined;
    if (parent) {
      builder.addEdge(createVariantEdge(parent, letter, 'parent-first'));
    }
  }

  // Add articulation areas
  for (const area of data.articulationAreas) {
    builder.addNode(createArticulationAreaNode(area));
  }

  // Add articulation points and point-area edges
  for (const point of data.articulationPoints) {
    builder.addNode(createArticulationPointNode(point));
    builder.addEdge({
      id: `edge-area-${point.areaId}-point-${point.id}`,
      source: `point-${point.id}`,
      target: `area-${point.areaId}`,
      type: 'default',
      style: { stroke: '#0EA5E9', strokeWidth: 1 },
    });
  }

  // Add trait groups
  for (const group of data.traitGroups) {
    builder.addNode(createTraitGroupNode(group));
  }

  // Add traits and trait-group edges
  for (const trait of data.traits) {
    builder.addNode(createTraitNode(trait));
    builder.addEdge({
      id: `edge-group-${trait.groupId}-trait-${trait.id}`,
      source: `trait-${trait.id}`,
      target: `trait-group-${trait.groupId}`,
      type: 'default',
      style: { stroke: '#8B5CF6', strokeWidth: 1 },
    });
  }

  // Add letter-point edges
  for (const rel of data.letterArticulations) {
    builder.addEdge({
      id: `edge-letter-${rel.letterId}-point-${rel.pointId}`,
      source: `letter-${rel.letterId}`,
      target: `point-${rel.pointId}`,
      type: 'default',
      style: {
        stroke: '#0EA5E9',
        strokeWidth: 1,
        opacity: 0.5,
      },
    });
  }

  // Add letter-trait edges
  for (const rel of data.letterTraits) {
    builder.addEdge({
      id: `edge-letter-${rel.letterId}-trait-${rel.traitId}`,
      source: `letter-${rel.letterId}`,
      target: `trait-${rel.traitId}`,
      type: 'default',
      style: {
        stroke: '#8B5CF6',
        strokeWidth: 1,
        opacity: 0.6,
      },
    });
  }

  return builder.build();
}

/**
 * Adds the parent (waw/ya) of a variant letter node plus the connecting edge.
 * Flow is child -> parent because variants hang below their makhraj/trait.
 */
function addVariantParent(
  builder: GraphBuilder,
  letter: Letter,
  letterBySlug: Map<string, Letter>,
) {
  const parent = letter.parentLetterSlug
    ? letterBySlug.get(letter.parentLetterSlug)
    : undefined;
  if (!parent) return;

  builder.addNode(createLetterNode(parent));
  builder.addEdge(createVariantEdge(parent, letter, 'child-first'));
}

function generateByArticulationView(data: GraphData): GraphView {
  const builder = createGraphBuilder();
  const letterBySlug = getLetterBySlug(data.letters);
  const letterById = new Map(data.letters.map((l) => [l.id, l]));

  // Group letters by articulation point
  const lettersByPoint = new Map<number, Letter[]>();
  for (const rel of data.letterArticulations) {
    const letter = letterById.get(rel.letterId);
    if (!letter) continue;

    const letters = lettersByPoint.get(rel.pointId) ?? [];
    letters.push(letter);
    lettersByPoint.set(rel.pointId, letters);
  }

  // Add articulation areas
  for (const area of data.articulationAreas) {
    builder.addNode(createArticulationAreaNode(area));
  }

  for (const point of data.articulationPoints) {
    builder.addNode(createArticulationPointNode(point));

    // Add area-point edges
    builder.addEdge({
      id: `edge-area-${point.areaId}-point-${point.id}`,
      source: `area-${point.areaId}`,
      target: `point-${point.id}`,
      type: 'default',
      style: { stroke: '#0EA5E9', strokeWidth: 2 },
    });

    // Add letters and point-letter edges
    for (const letter of lettersByPoint.get(point.id) ?? []) {
      builder.addNode(createLetterNode(letter));
      builder.addEdge({
        id: `edge-point-${point.id}-letter-${letter.id}`,
        source: `point-${point.id}`,
        target: `letter-${letter.id}`,
        type: 'default',
        style: { stroke: '#F59E0B' },
      });
      addVariantParent(builder, letter, letterBySlug);
    }
  }

  return builder.build();
}

function generateByTraitView(data: GraphData): GraphView {
  const builder = createGraphBuilder();
  const letterBySlug = getLetterBySlug(data.letters);
  const letterById = new Map(data.letters.map((l) => [l.id, l]));

  // Group letters by trait
  const lettersByTrait = new Map<number, Letter[]>();
  for (const rel of data.letterTraits) {
    const letter = letterById.get(rel.letterId);
    if (!letter) continue;

    const letters = lettersByTrait.get(rel.traitId) ?? [];
    letters.push(letter);
    lettersByTrait.set(rel.traitId, letters);
  }

  // Add trait groups
  for (const group of data.traitGroups) {
    builder.addNode(createTraitGroupNode(group));
  }

  for (const trait of data.traits) {
    builder.addNode(createTraitNode(trait));

    // Add group-trait edges
    builder.addEdge({
      id: `edge-group-${trait.groupId}-trait-${trait.id}`,
      source: `trait-group-${trait.groupId}`,
      target: `trait-${trait.id}`,
      type: 'default',
      style: { stroke: '#8B5CF6' },
    });

    // Add letters and trait-letter edges
    for (const letter of lettersByTrait.get(trait.id) ?? []) {
      builder.addNode(createLetterNode(letter));
      builder.addEdge({
        id: `edge-trait-${trait.id}-letter-${letter.id}`,
        source: `trait-${trait.id}`,
        target: `letter-${letter.id}`,
        type: 'default',
        style: { stroke: '#F59E0B', opacity: 0.7 },
      });
      addVariantParent(builder, letter, letterBySlug);
    }
  }

  return builder.build();
}

function generateByLetterView(data: GraphData, selectedId: number): GraphView {
  const builder = createGraphBuilder();
  const letterBySlug = getLetterBySlug(data.letters);

  const selected = data.letters.find((l) => l.id === selectedId);
  if (!selected) return builder.build();

  // Selecting a waw/ya variant child shows the whole family of its root letter
  const root =
    (selected.parentLetterSlug
      ? letterBySlug.get(selected.parentLetterSlug)
      : undefined) ?? selected;
  const variants = data.letters.filter((l) => l.parentLetterSlug === root.slug);

  builder.addNode(createLetterNode(root));
  for (const variant of variants) {
    builder.addNode(createLetterNode(variant));
    builder.addEdge(createVariantEdge(root, variant, 'parent-first'));
  }

  // Root letters with variants delegate their relations to the variants
  const relatedLetters = variants.length > 0 ? variants : [root];

  for (const letter of relatedLetters) {
    // Articulation points & areas
    for (const rel of data.letterArticulations) {
      if (rel.letterId !== letter.id) continue;

      const point = data.articulationPoints.find((p) => p.id === rel.pointId);
      if (!point) continue;

      builder.addNode(createArticulationPointNode(point));
      builder.addEdge({
        id: `edge-letter-${letter.id}-point-${point.id}`,
        source: `letter-${letter.id}`,
        target: `point-${point.id}`,
        type: 'default',
        style: { stroke: '#0EA5E9', strokeWidth: 1 },
      });

      const area = data.articulationAreas.find((a) => a.id === point.areaId);
      if (area) {
        builder.addNode(createArticulationAreaNode(area));
        builder.addEdge({
          id: `edge-area-${area.id}-point-${point.id}`,
          source: `point-${point.id}`,
          target: `area-${area.id}`,
          type: 'default',
          style: { stroke: '#0EA5E9' },
        });
      }
    }

    // Traits & trait groups
    for (const rel of data.letterTraits) {
      if (rel.letterId !== letter.id) continue;

      const trait = data.traits.find((t) => t.id === rel.traitId);
      if (!trait) continue;

      builder.addNode(createTraitNode(trait));
      builder.addEdge({
        id: `edge-letter-${letter.id}-trait-${trait.id}`,
        source: `letter-${letter.id}`,
        target: `trait-${trait.id}`,
        type: 'default',
        style: { stroke: '#8B5CF6' },
      });

      const group = data.traitGroups.find((g) => g.id === trait.groupId);
      if (group) {
        builder.addNode(createTraitGroupNode(group));
        builder.addEdge({
          id: `edge-trait-${trait.id}-group-${group.id}`,
          source: `trait-${trait.id}`,
          target: `trait-group-${group.id}`,
          type: 'default',
          style: { stroke: '#8B5CF6' },
        });
      }
    }
  }

  return builder.build();
}
