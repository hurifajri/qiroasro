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
  isArticulationVisible: boolean;
  isTraitVisible: boolean;
}

interface GraphView {
  nodes: Node[];
  edges: Edge[];
}

const ARTICULATION_NODE_TYPES = new Set([
  'articulationArea',
  'articulationPoint',
]);
const TRAIT_NODE_TYPES = new Set(['traitGroup', 'trait']);

/** Removes hidden node types along with every edge touching them. */
function filterHiddenNodes(
  view: GraphView,
  options: Pick<
    GenerateGraphOptions,
    'isArticulationVisible' | 'isTraitVisible'
  >,
): GraphView {
  const { isArticulationVisible, isTraitVisible } = options;
  if (isArticulationVisible && isTraitVisible) return view;

  const nodes = view.nodes.filter(
    (node) =>
      (isArticulationVisible ||
        !ARTICULATION_NODE_TYPES.has(node.type ?? '')) &&
      (isTraitVisible || !TRAIT_NODE_TYPES.has(node.type ?? '')),
  );
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = view.edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
  );

  return { nodes, edges };
}

export function generateGraphFromData(
  data: GraphData,
  options: GenerateGraphOptions,
): GraphView {
  const { viewMode, selectedId } = options;

  const view =
    viewMode === 'all'
      ? generateAllView(data)
      : generateByLetterView(data, selectedId);

  return filterHiddenNodes(view, options);
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
