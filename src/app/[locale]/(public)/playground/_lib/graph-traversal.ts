import type { Edge } from '@xyflow/react';
import { getCategory, getNodeType } from './node';

function getNeighborId(edge: Edge, nodeId: string): string | null {
  if (edge.source === nodeId) return edge.target;
  if (edge.target === nodeId) return edge.source;
  return null;
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
  const level1Nodes = new Set<string>();
  for (const edge of edges) {
    const neighborId = getNeighborId(edge, selectedNodeId);
    if (!neighborId) continue;

    level1Nodes.add(neighborId);
    connectedNodeIds.add(neighborId);
    connectedEdgeIds.add(edge.id);
  }

  // Level 2: Connections of level 1 nodes
  // Also collect nodes that need 1 extra hop for root <-> variant branching
  const level2TargetNodes = new Set<string>();
  const level2LetterNodes = new Set<string>();

  for (const nodeId of level1Nodes) {
    const nodeType = getNodeType(nodeId);

    for (const edge of edges) {
      const neighborId = getNeighborId(edge, nodeId);
      if (!neighborId || neighborId === selectedNodeId) continue;

      const neighborType = getNodeType(neighborId);
      const neighborCategory = getCategory(neighborType);

      if (neighborType === selectedType) continue;
      if (
        selectedCategory !== 'letter' &&
        neighborCategory !== selectedCategory &&
        neighborCategory !== 'letter'
      ) {
        continue;
      }

      connectedNodeIds.add(neighborId);
      connectedEdgeIds.add(edge.id);

      // Selected root letter (waw/ya) -> Level 1 variant -> Level 2 point/trait
      if (
        selectedType === 'letter' &&
        nodeType === 'letter' &&
        (neighborType === 'point' || neighborType === 'trait')
      ) {
        level2TargetNodes.add(neighborId);
      }

      // Selected area/traitGroup -> Level 1 point/trait -> Level 2 letter
      if (
        (selectedType === 'area' || selectedType === 'traitGroup') &&
        neighborType === 'letter'
      ) {
        level2LetterNodes.add(neighborId);
      }
    }
  }

  // Level 3a: point/trait reached via variant child -> area/traitGroup
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

  // Level 3b: variant child reached from area/traitGroup -> parent root letter
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

  return { connectedNodeIds, connectedEdgeIds };
}
