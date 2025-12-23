import { type NodeProps, Position } from '@xyflow/react';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { NODE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';

interface LetterNodeData {
  label: string;
  slug: string;
  isMadd: boolean;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
}

export function LetterNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as LetterNodeData;
  const bgColor = nodeData.isMadd ? NODE_COLORS.letter.madd : NODE_COLORS.letter.primary;

  // Determine handle positions based on layout
  const isRadial = nodeData.layoutMode === 'radial';
  const isHierarchical = nodeData.layoutMode === 'hierarchical';
  const isVertical = nodeData.hierarchyDirection === 'vertical';
  const isVerticalLayout = isRadial || (isHierarchical && isVertical);

  const targetPosition = isVerticalLayout ? Position.Top : Position.Left;
  const sourcePosition = isVerticalLayout ? Position.Bottom : Position.Right;

  // Hide handles: when floating OR when no edge connected
  const getHandleClass = (hasEdge: boolean) => {
    if (nodeData.isFloating || !hasEdge) return 'hidden';
    return 'size-2 border-0! bg-amber-300!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return (
    <BaseNode
      className={cn(
        'flex h-16 w-16 items-center justify-center rounded-full border-0 shadow-lg transition-all duration-300',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
      style={{
        background: nodeData.isMadd
          ? `linear-gradient(135deg, ${NODE_COLORS.letter.madd} 0%, #DC2626 100%)`
          : NODE_COLORS.letter.gradient,
        boxShadow: `0 4px 20px ${bgColor} 40`,
      }}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="flex select-none items-center justify-center p-0 font-bold text-3xl text-white">
        {nodeData.label}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
}
