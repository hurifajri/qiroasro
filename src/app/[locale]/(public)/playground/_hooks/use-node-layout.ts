import { Position } from '@xyflow/react';
import { useCallback } from 'react';

import type { BaseNodeData } from '../_schemas/node';

/**
 * Hook to compute layout positions and visual state for graph nodes.
 * Extracts common logic shared across LetterNode, TraitNode, and ArticulationNode.
 */
export function useNodeLayout(
  nodeData: BaseNodeData,
  handleColorClass: string,
  selected?: boolean,
) {
  // Determine handle positions based on layout
  const isRadial = nodeData.layoutMode === 'radial';
  const isHierarchical = nodeData.layoutMode === 'hierarchical';
  const isVertical = nodeData.hierarchyDirection === 'vertical';
  const isVerticalLayout = isRadial || (isHierarchical && isVertical);

  const targetPosition = isVerticalLayout ? Position.Top : Position.Left;
  const sourcePosition = isVerticalLayout ? Position.Bottom : Position.Right;

  // Hide handles: when floating OR when no edge connected
  // Memoized to prevent new function reference on each render
  const getHandleClass = useCallback(
    (hasEdge: boolean) => {
      if (nodeData.isFloating || !hasEdge) {
        return 'pointer-events-none opacity-0';
      }
      return `size-2 border-0! ${handleColorClass}`;
    },
    [nodeData.isFloating, handleColorClass],
  );

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected ?? nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return {
    targetPosition,
    sourcePosition,
    getHandleClass,
    isActive,
    isDimmed,
  };
}
