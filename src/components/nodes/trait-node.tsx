import { type NodeProps, Position } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';
import type { Trait, TraitGroup } from '@/schemas/trait';

type TraitGroupNodeData = TraitGroup & {
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};

type TraitNodeData = Trait & {
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};

export function TraitGroupNode({ data, selected }: NodeProps) {
  const t = useTranslations('global.trait_group');

  const nodeData = data as unknown as TraitGroupNodeData;

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
    return 'size-2 border-0! bg-node-trait-secondary!';
  };

  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(localeKey);

  return (
    <BaseNode
      className={cn(
        'rounded-xl border-0 px-6 py-4 transition-all duration-300 hover:ring-0',
        'bg-linear-to-br from-node-trait to-node-trait-dark',
        isActive ? 'scale-110 shadow-lg shadow-node-trait/40' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="flex select-none flex-col items-center p-0 font-semibold text-node-letter-text text-sm capitalize">
        {label}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
}

export function TraitNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as TraitNodeData;

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
    return 'size-2 border-0! bg-node-trait-secondary!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return (
    <BaseNode
      className={cn(
        'group rounded-lg border-2 border-node-trait/50 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:ring-0',
        'bg-node-trait/20 text-node-trait-text hover:bg-node-trait/30',
        isActive && 'scale-110 bg-node-trait/40',
        !isActive && 'hover:scale-105',
        isDimmed && 'opacity-30',
        ['tafkhim', 'tarqiq'].includes(nodeData.slug) && 'border-dashed',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="flex select-none flex-col items-center p-0 font-medium text-xs capitalize">
        {nodeData.slug.replace(/-/g, ' ')}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
}
