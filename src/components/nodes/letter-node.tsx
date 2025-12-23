import { type NodeProps, Position } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';
import type { Letter } from '@/schemas/letter';

type LetterNodeData = Letter & {
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};

export function LetterNode({ data, selected }: NodeProps) {
  const t = useTranslations('global.letter');

  const nodeData = data as unknown as LetterNodeData;

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
    return 'size-2 border-0! bg-node-letter-secondary!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = `(${t(localeKey)})`;

  return (
    <BaseNode
      className={cn(
        'flex size-24 items-center justify-center rounded-full border-0 shadow-lg transition-all duration-300 hover:ring-0',
        nodeData.isMadd
          ? 'bg-linear-to-br from-node-letter-madd to-node-letter-madd-dark shadow-node-letter-madd/40'
          : 'bg-linear-to-br from-node-letter to-node-letter-dark shadow-node-letter/40',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="flex select-none items-center justify-center gap-2 p-0 text-node-letter-text">
        <span className="font-bold text-3xl">{nodeData.symbol}</span>
        <span className="text-xs">{label}</span>
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
}
