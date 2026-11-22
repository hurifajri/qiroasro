import type { Edge } from '@xyflow/react';

import { getCategory, getNodeType } from './node';

function getNeighborId(edge: Edge, nodeId: string): string | null {
  if (edge.source === nodeId) return edge.target;
  if (edge.target === nodeId) return edge.source;
  return null;
}

function collectLevel1Connections(
  selectedNodeId: string,
  edges: Edge[],
  connectedNodeIds: Set<string>,
  connectedEdgeIds: Set<string>,
): Set<string> {
  const level1Nodes = new Set<string>();
  for (const edge of edges) {
    const neighborId = getNeighborId(edge, selectedNodeId);
    if (!neighborId) continue;

    level1Nodes.add(neighborId);
    connectedNodeIds.add(neighborId);
    connectedEdgeIds.add(edge.id);
  }
  return level1Nodes;
}

function isValidLevel2Neighbor(
  selectedType: string,
  selectedCategory: string,
  neighborType: string,
): boolean {
  if (neighborType === selectedType) return false;
  if (selectedCategory === 'letter') return true;
  const neighborCategory = getCategory(neighborType);
  return neighborCategory === selectedCategory || neighborCategory === 'letter';
}

function collectLevel2ForNode(
  nodeId: string,
  selectedNodeId: string,
  selectedType: string,
  selectedCategory: string,
  edges: Edge[],
  connectedNodeIds: Set<string>,
  connectedEdgeIds: Set<string>,
  level2TargetNodes: Set<string>,
  level2LetterNodes: Set<string>,
) {
  const nodeType = getNodeType(nodeId);
  const isRootLetterBranch = selectedType === 'letter' && nodeType === 'letter';
  const isGroupSelection =
    selectedType === 'area' || selectedType === 'traitGroup';

  for (const edge of edges) {
    const neighborId = getNeighborId(edge, nodeId);
    if (!neighborId || neighborId === selectedNodeId) continue;

    const neighborType = getNodeType(neighborId);
    if (!isValidLevel2Neighbor(selectedType, selectedCategory, neighborType)) {
      continue;
    }

    connectedNodeIds.add(neighborId);
    connectedEdgeIds.add(edge.id);

    // Selected root letter (waw/ya) -> Level 1 variant -> Level 2 point/trait
    if (
      isRootLetterBranch &&
      (neighborType === 'point' || neighborType === 'trait')
    ) {
      level2TargetNodes.add(neighborId);
    }

    // Selected area/traitGroup -> Level 1 point/trait -> Level 2 letter
    if (isGroupSelection && neighborType === 'letter') {
      level2LetterNodes.add(neighborId);
    }
  }
}

function collectLevel2Connections(
  selectedNodeId: string,
  selectedType: string,
  selectedCategory: string,
  level1Nodes: Set<string>,
  edges: Edge[],
  connectedNodeIds: Set<string>,
  connectedEdgeIds: Set<string>,
) {
  const level2TargetNodes = new Set<string>();
  const level2LetterNodes = new Set<string>();

  for (const nodeId of level1Nodes) {
    collectLevel2ForNode(
      nodeId,
      selectedNodeId,
      selectedType,
      selectedCategory,
      edges,
      connectedNodeIds,
      connectedEdgeIds,
      level2TargetNodes,
      level2LetterNodes,
    );
  }

  return { level2TargetNodes, level2LetterNodes };
}

function collectLevel3AreaConnections(
  selectedNodeId: string,
  level2TargetNodes: Set<string>,
  edges: Edge[],
  connectedNodeIds: Set<string>,
  connectedEdgeIds: Set<string>,
) {
  for (const nodeId of level2TargetNodes) {
    for (const edge of edges) {
      const neighborId = getNeighborId(edge, nodeId);
      if (!neighborId || neighborId === selectedNodeId) continue;

      const neighborType = getNodeType(neighborId);
      if (neighborType === 'area' || neighborType === 'traitGroup') {
        connectedNodeIds.add(neighborId);
        connectedEdgeIds.add(edge.id);
      }
    }
  }
}

function collectLevel3VariantParents(
  selectedNodeId: string,
  level2LetterNodes: Set<string>,
  edges: Edge[],
  connectedNodeIds: Set<string>,
  connectedEdgeIds: Set<string>,
) {
  for (const letterNodeId of level2LetterNodes) {
    for (const edge of edges) {
      const neighborId = getNeighborId(edge, letterNodeId);
      if (!neighborId || neighborId === selectedNodeId) continue;

      if (edge.id.startsWith(`edge-${neighborId}-variant-`)) {
        connectedNodeIds.add(neighborId);
        connectedEdgeIds.add(edge.id);
      }
    }
  }
}

// Compute connected nodes and edges for highlighting
export function computeHighlight(selectedNodeId: string | null, edges: Edge[]) {
  const connectedNodeIds = new Set<string>();
  const connectedEdgeIds = new Set<string>();

  if (!selectedNodeId) {
    return { connectedNodeIds, connectedEdgeIds };
  }

  const selectedType = getNodeType(selectedNodeId);
  const selectedCategory = getCategory(selectedType);

  // Level 1: All direct connections (bidirectional)
  const level1Nodes = collectLevel1Connections(
    selectedNodeId,
    edges,
    connectedNodeIds,
    connectedEdgeIds,
  );

  // Level 2: Connections of level 1 nodes
  const { level2TargetNodes, level2LetterNodes } = collectLevel2Connections(
    selectedNodeId,
    selectedType,
    selectedCategory,
    level1Nodes,
    edges,
    connectedNodeIds,
    connectedEdgeIds,
  );

  // Level 3a: point/trait reached via variant child -> area/traitGroup
  collectLevel3AreaConnections(
    selectedNodeId,
    level2TargetNodes,
    edges,
    connectedNodeIds,
    connectedEdgeIds,
  );

  // Level 3b: variant child reached from area/traitGroup -> parent root letter
  collectLevel3VariantParents(
    selectedNodeId,
    level2LetterNodes,
    edges,
    connectedNodeIds,
    connectedEdgeIds,
  );

  return { connectedNodeIds, connectedEdgeIds };
}
