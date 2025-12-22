import type { Edge, Node } from '@xyflow/react';
import type {
  ArticulationArea,
  ArticulationPoint,
} from '@/schemas/articulation';
import type {
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '@/schemas/common';
import type { Letter, LetterArticulation, LetterTrait } from '@/schemas/letter';
import type { Trait, TraitGroup } from '@/schemas/trait';

// ============================================
// Node Creation Helpers
// ============================================

interface Graph {
  letters: Letter[];
  letterArticulations: LetterArticulation[];
  letterTraits: LetterTrait[];
  articulationAreas: ArticulationArea[];
  articulationPoints: ArticulationPoint[];
  traits: Trait[];
  traitGroups: TraitGroup[];
}

export function createLetterNode(
  letter: Letter,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `letter-${letter.id}`,
    type: 'letter',
    position,
    data: {
      label: letter.symbol,
      slug: letter.slug,
      isMadd: letter.isMadd,
    },
  };
}

export function createArticulationAreaNode(
  area: ArticulationArea,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `area-${area.id}`,
    type: 'articulation-area',
    position,
    data: {
      label: area.slug,
      slug: area.slug,
    },
  };
}

export function createArticulationPointNode(
  point: ArticulationPoint,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `point-${point.id}`,
    type: 'articulation-point',
    position,
    data: {
      label: point.slug,
      slug: point.slug,
      areaId: point.areaId,
    },
  };
}

export function createTraitGroupNode(
  group: TraitGroup,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `trait-group-${group.id}`,
    type: 'trait-group',
    position,
    data: {
      label: group.slug,
      slug: group.slug,
      isLazimah: group.isLazimah,
    },
  };
}

export function createTraitNode(
  trait: Trait,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `trait-${trait.id}`,
    type: 'trait',
    position,
    data: {
      label: trait.slug,
      slug: trait.slug,
      groupId: trait.groupId,
      isMiddleTrait: trait.isMiddleTrait,
    },
  };
}

// ============================================
// Graph Generation (creates nodes/edges without positions)
// ============================================

interface GenerateGraphOptions {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedId?: number;
}

export function generateGraphFromData(
  data: Graph,
  options: GenerateGraphOptions,
): { nodes: Node[]; edges: Edge[] } {
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

function generateAllView(data: Graph): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add all letters
  for (const letter of data.letters) {
    nodes.push(createLetterNode(letter));
  }

  // Add articulation areas and points
  for (const area of data.articulationAreas) {
    nodes.push(createArticulationAreaNode(area));
  }

  for (const point of data.articulationPoints) {
    nodes.push(createArticulationPointNode(point));

    // Area to point edge
    edges.push({
      id: `edge-area-${point.areaId}-point-${point.id}`,
      source: `area-${point.areaId}`,
      target: `point-${point.id}`,
      type: 'default',
      style: { stroke: '#0EA5E9', strokeWidth: 1 },
    });
  }

  // Add trait groups and traits
  for (const group of data.traitGroups) {
    nodes.push(createTraitGroupNode(group));
  }

  for (const trait of data.traits) {
    nodes.push(createTraitNode(trait));

    // Group to trait edge
    edges.push({
      id: `edge-group-${trait.groupId}-trait-${trait.id}`,
      source: `trait-group-${trait.groupId}`,
      target: `trait-${trait.id}`,
      type: 'default',
      style: { stroke: '#8B5CF6', strokeWidth: 1 },
    });
  }

  // Letter-articulation edges
  for (const rel of data.letterArticulations) {
    edges.push({
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

  // Letter-trait edges
  for (const rel of data.letterTraits) {
    edges.push({
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

  return { nodes, edges };
}

function generateByArticulationView(data: Graph): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group letters by articulation point
  const lettersByPoint = new Map<number, Letter[]>();
  for (const rel of data.letterArticulations) {
    const letter = data.letters.find((l) => l.id === rel.letterId);
    if (letter && rel.isPrimary) {
      if (!lettersByPoint.has(rel.pointId)) {
        lettersByPoint.set(rel.pointId, []);
      }
      lettersByPoint.get(rel.pointId)?.push(letter);
    }
  }

  // Add areas
  for (const area of data.articulationAreas) {
    nodes.push(createArticulationAreaNode(area));
  }

  // Add points and their letters
  for (const point of data.articulationPoints) {
    nodes.push(createArticulationPointNode(point));

    // Area to point edge
    edges.push({
      id: `edge-area-${point.areaId}-point-${point.id}`,
      source: `area-${point.areaId}`,
      target: `point-${point.id}`,
      type: 'default',
      style: { stroke: '#0EA5E9', strokeWidth: 2 },
    });

    // Add letters for this point
    const letters = lettersByPoint.get(point.id) || [];
    for (const letter of letters) {
      if (!nodes.find((n) => n.id === `letter-${letter.id}`)) {
        nodes.push(createLetterNode(letter));
      }
      edges.push({
        id: `edge-point-${point.id}-letter-${letter.id}`,
        source: `point-${point.id}`,
        target: `letter-${letter.id}`,
        type: 'default',
        style: { stroke: '#F59E0B' },
      });
    }
  }

  return { nodes, edges };
}

function generateByTraitView(data: Graph): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group letters by trait
  const lettersByTrait = new Map<number, Letter[]>();
  for (const rel of data.letterTraits) {
    const letter = data.letters.find((l) => l.id === rel.letterId);
    if (letter) {
      if (!lettersByTrait.has(rel.traitId)) {
        lettersByTrait.set(rel.traitId, []);
      }
      lettersByTrait.get(rel.traitId)?.push(letter);
    }
  }

  // Add trait groups
  for (const group of data.traitGroups) {
    nodes.push(createTraitGroupNode(group));
  }

  // Add traits and their letters
  for (const trait of data.traits) {
    nodes.push(createTraitNode(trait));

    // Group to trait edge
    edges.push({
      id: `edge-group-${trait.groupId}-trait-${trait.id}`,
      source: `trait-group-${trait.groupId}`,
      target: `trait-${trait.id}`,
      type: 'default',
      style: { stroke: '#8B5CF6' },
    });

    // Add letters for this trait
    const letters = lettersByTrait.get(trait.id) || [];
    for (const letter of letters) {
      if (!nodes.find((n) => n.id === `letter-${letter.id}`)) {
        nodes.push(createLetterNode(letter));
      }
      edges.push({
        id: `edge-trait-${trait.id}-letter-${letter.id}`,
        source: `trait-${trait.id}`,
        target: `letter-${letter.id}`,
        type: 'default',
        style: { stroke: '#F59E0B', opacity: 0.7 },
      });
    }
  }

  return { nodes, edges };
}

function generateByLetterView(
  data: Graph,
  selectedId?: number,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // If no letter selected, show all letters only
  if (!selectedId) {
    for (const letter of data.letters) {
      nodes.push(createLetterNode(letter));
    }
    return { nodes, edges };
  }

  // Find selected letter
  const letter = data.letters.find((l) => l.id === selectedId);
  if (!letter) return { nodes, edges };

  // Add selected letter
  nodes.push(createLetterNode(letter));

  // Find related articulation points
  const relatedArticulations = data.letterArticulations.filter(
    (rel) => rel.letterId === selectedId,
  );

  for (const rel of relatedArticulations) {
    const point = data.articulationPoints.find((p) => p.id === rel.pointId);
    if (!point) continue;

    nodes.push(createArticulationPointNode(point));
    edges.push({
      id: `edge-letter-${letter.id}-point-${point.id}`,
      source: `letter-${letter.id}`,
      target: `point-${point.id}`,
      type: 'default',
      style: {
        stroke: '#0EA5E9',
        strokeWidth: 1,
      },
    });

    // Add area
    const area = data.articulationAreas.find((a) => a.id === point.areaId);
    if (area && !nodes.find((n) => n.id === `area-${area.id}`)) {
      nodes.push(createArticulationAreaNode(area));
      edges.push({
        id: `edge-area-${area.id}-point-${point.id}`,
        source: `area-${area.id}`,
        target: `point-${point.id}`,
        type: 'default',
        style: { stroke: '#0EA5E9' },
      });
    }
  }

  // Find related traits
  const relatedTraitRels = data.letterTraits.filter(
    (rel) => rel.letterId === selectedId,
  );

  for (const rel of relatedTraitRels) {
    const trait = data.traits.find((t) => t.id === rel.traitId);
    if (!trait) continue;

    nodes.push(createTraitNode(trait));
    edges.push({
      id: `edge-letter-${letter.id}-trait-${trait.id}`,
      source: `letter-${letter.id}`,
      target: `trait-${trait.id}`,
      type: 'default',
      style: { stroke: '#8B5CF6' },
    });

    // Add trait group
    const group = data.traitGroups.find((g) => g.id === trait.groupId);
    if (group && !nodes.find((n) => n.id === `trait-group-${group.id}`)) {
      nodes.push(createTraitGroupNode(group));
      edges.push({
        id: `edge-trait-${trait.id}-group-${group.id}`,
        source: `trait-${trait.id}`,
        target: `trait-group-${group.id}`,
        type: 'default',
        style: { stroke: '#8B5CF6' },
      });
    }
  }

  return { nodes, edges };
}
