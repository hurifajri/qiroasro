import { type NodeProps, Position } from '@xyflow/react';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { NODE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';

interface ArticulationAreaNodeData {
  label: string;
  slug: string;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
}

interface ArticulationPointNodeData {
  label: string;
  slug: string;
  areaId: number;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
}

export function ArticulationAreaNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ArticulationAreaNodeData;

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
    return 'size-2 border-0! bg-sky-300!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return (
    <BaseNode
      className={cn(
        'flex items-center justify-center rounded-xl border-0 px-5 py-3 shadow-lg transition-all duration-300',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
      style={{
        background: NODE_COLORS.articulation.gradient,
        boxShadow: `0 4px 20px ${NODE_COLORS.articulation.primary}40`,
      }}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="select-none p-0 font-semibold text-sm text-white capitalize">
        {nodeData.label.replace(/-/g, ' ')}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
}

export function ArticulationPointNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ArticulationPointNodeData;

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
    return 'size-2 border-0! bg-sky-300!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return (
    <BaseNode
      className={cn(
        'group flex items-center justify-center rounded-lg border-2 border-sky-400/50 bg-sky-500/20 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:ring-0',
        isActive ? 'scale-110 bg-sky-500/40' : 'hover:scale-105 hover:bg-sky-500/30',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="select-none p-0 font-medium text-sky-700 text-xs capitalize dark:text-sky-100">
        {nodeData.label.replace(/-/g, ' ')}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
}
