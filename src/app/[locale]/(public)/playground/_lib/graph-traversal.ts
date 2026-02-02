import type { Edge } from '@xyflow/react';
import { getCategory, getNodeType } from './node';

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
    if (edge.source === selectedNodeId) {
      level1Nodes.add(edge.target);
      connectedNodeIds.add(edge.target);
      connectedEdgeIds.add(edge.id);
    }
    if (edge.target === selectedNodeId) {
      level1Nodes.add(edge.source);
      connectedNodeIds.add(edge.source);
      connectedEdgeIds.add(edge.id);
    }
  }

  // Level 2: Connections of level 1 nodes
  for (const nodeId of level1Nodes) {
    for (const edge of edges) {
      if (edge.source === nodeId && edge.target !== selectedNodeId) {
        const targetType = getNodeType(edge.target);
        const targetCategory = getCategory(targetType);

        if (targetType === selectedType) continue;
        if (selectedCategory !== 'letter') {
          if (
            targetCategory !== selectedCategory &&
            targetCategory !== 'letter'
          )
            continue;
        }

        connectedNodeIds.add(edge.target);
        connectedEdgeIds.add(edge.id);
      }
      if (edge.target === nodeId && edge.source !== selectedNodeId) {
        const sourceType = getNodeType(edge.source);
        const sourceCategory = getCategory(sourceType);

        if (sourceType === selectedType) continue;
        if (selectedCategory !== 'letter') {
          if (
            sourceCategory !== selectedCategory &&
            sourceCategory !== 'letter'
          )
            continue;
        }

        connectedNodeIds.add(edge.source);
        connectedEdgeIds.add(edge.id);
      }
    }
  }

  return { connectedNodeIds, connectedEdgeIds };
}
