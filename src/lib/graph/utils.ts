import type { Edge, Node } from '@xyflow/react';
import type { ArticulationArea, ArticulationPoint } from '@/schemas/articulation';
import type { HierarchyDirection, LayoutMode, ViewMode } from '@/schemas/graph';
import type { Letter, LetterArticulation, LetterTrait } from '@/schemas/letter';
import type { Trait, TraitGroup } from '@/schemas/trait';

// ============================================
// Node Creation Helpers
// ============================================

export interface GraphData {
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
    data: letter,
  };
}

export function createArticulationAreaNode(
  area: ArticulationArea,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `area-${area.id}`,
    type: 'articulationArea',
    position,
    data: area,
  };
}

export function createArticulationPointNode(
  point: ArticulationPoint,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `point-${point.id}`,
    type: 'articulationPoint',
    position,
    data: point,
  };
}

export function createTraitGroupNode(
  group: TraitGroup,
  position: { x: number; y: number } = { x: 0, y: 0 },
): Node {
  return {
    id: `trait-group-${group.id}`,
    type: 'traitGroup',
    position,
    data: group,
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
    data: trait,
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

interface GraphView {
  nodes: Node[];
  edges: Edge[];
}

export function generateGraphFromData(data: GraphData, options: GenerateGraphOptions): GraphView {
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

function generateAllView(data: GraphData): GraphView {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add letters
  for (const letter of data.letters) {
    nodes.push(createLetterNode(letter));
  }

  // Add articulation areas
  for (const area of data.articulationAreas) {
    nodes.push(createArticulationAreaNode(area));
  }

  // Add articulation points
  for (const point of data.articulationPoints) {
    nodes.push(createArticulationPointNode(point));

    // Add point-area edges
    edges.push({
      id: `edge-area-${point.areaId}-point-${point.id}`,
      source: `point-${point.id}`,
      target: `area-${point.areaId}`,
      type: 'default',
      style: { stroke: '#0EA5E9', strokeWidth: 1 },
    });
  }

  // Add trait groups
  for (const group of data.traitGroups) {
    nodes.push(createTraitGroupNode(group));
  }

  // Add traits
  for (const trait of data.traits) {
    nodes.push(createTraitNode(trait));

    // Add trait-group edges
    edges.push({
      id: `edge-group-${trait.groupId}-trait-${trait.id}`,
      source: `trait-${trait.id}`,
      target: `trait-group-${trait.groupId}`,
      type: 'default',
      style: { stroke: '#8B5CF6', strokeWidth: 1 },
    });
  }

  // Add letter-point edges
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

  // Add letter-trait edges
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

function generateByArticulationView(data: GraphData): GraphView {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group letters by articulation point
  const lettersByPoint = new Map<number, Letter[]>();
  for (const rel of data.letterArticulations) {
    const letter = data.letters.find((l) => l.id === rel.letterId);
    if (letter) {
      if (!lettersByPoint.has(rel.pointId)) {
        lettersByPoint.set(rel.pointId, []);
      }
      lettersByPoint.get(rel.pointId)?.push(letter);
    }
  }

  // Add articulation areas
  for (const area of data.articulationAreas) {
    nodes.push(createArticulationAreaNode(area));
  }

  // Add articulation points
  for (const point of data.articulationPoints) {
    nodes.push(createArticulationPointNode(point));

    // Add area-point edges
    edges.push({
      id: `edge-area-${point.areaId}-point-${point.id}`,
      source: `area-${point.areaId}`,
      target: `point-${point.id}`,
      type: 'default',
      style: { stroke: '#0EA5E9', strokeWidth: 2 },
    });

    // Add letters
    const letters = lettersByPoint.get(point.id) || [];
    for (const letter of letters) {
      if (!nodes.find((n) => n.id === `letter-${letter.id}`)) {
        nodes.push(createLetterNode(letter));
      }

      // Add point-letter edges
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

function generateByTraitView(data: GraphData): GraphView {
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

  // Add traits
  for (const trait of data.traits) {
    nodes.push(createTraitNode(trait));

    // Add group-trait edges
    edges.push({
      id: `edge-group-${trait.groupId}-trait-${trait.id}`,
      source: `trait-group-${trait.groupId}`,
      target: `trait-${trait.id}`,
      type: 'default',
      style: { stroke: '#8B5CF6' },
    });

    // Add letters
    const letters = lettersByTrait.get(trait.id) || [];
    for (const letter of letters) {
      if (!nodes.find((n) => n.id === `letter-${letter.id}`)) {
        nodes.push(createLetterNode(letter));
      }

      // Add trait-letter edges
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

function generateByLetterView(data: GraphData, selectedId?: number): GraphView {
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

  // Add articulation points
  for (const rel of relatedArticulations) {
    const point = data.articulationPoints.find((p) => p.id === rel.pointId);
    if (!point) continue;

    nodes.push(createArticulationPointNode(point));

    // Add letter-point edges
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

    // Add articulation areas
    const area = data.articulationAreas.find((a) => a.id === point.areaId);
    if (area && !nodes.find((n) => n.id === `area-${area.id}`)) {
      nodes.push(createArticulationAreaNode(area));

      // Add point-area edges
      edges.push({
        id: `edge-area-${area.id}-point-${point.id}`,
        source: `point-${point.id}`,
        target: `area-${area.id}`,
        type: 'default',
        style: { stroke: '#0EA5E9' },
      });
    }
  }

  // Find related traits
  const relatedTraitRels = data.letterTraits.filter((rel) => rel.letterId === selectedId);

  for (const rel of relatedTraitRels) {
    const trait = data.traits.find((t) => t.id === rel.traitId);
    if (!trait) continue;

    nodes.push(createTraitNode(trait));

    // Add letter-trait edges
    edges.push({
      id: `edge-letter-${letter.id}-trait-${trait.id}`,
      source: `letter-${letter.id}`,
      target: `trait-${trait.id}`,
      type: 'default',
      style: { stroke: '#8B5CF6' },
    });

    // Add trait group node if not exists
    const group = data.traitGroups.find((g) => g.id === trait.groupId);
    if (group && !nodes.find((n) => n.id === `trait-group-${group.id}`)) {
      nodes.push(createTraitGroupNode(group));
    }

    // Add trait-group edges
    if (group) {
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
