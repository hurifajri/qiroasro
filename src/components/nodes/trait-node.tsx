import { Handle, type NodeProps, Position } from '@xyflow/react';
import { NODE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';

interface TraitGroupNodeData {
  label: string;
  slug: string;
  isLazimah: boolean;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
}

interface TraitNodeData {
  label: string;
  slug: string;
  groupId: number;
  isMiddleTrait: boolean;
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
}

export function TraitGroupNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as TraitGroupNodeData;

  // Determine handle positions based on layout
  const useVerticalHandles =
    nodeData.layoutMode === 'radial' ||
    (nodeData.layoutMode === 'hierarchical' &&
      nodeData.hierarchyDirection === 'vertical');

  const targetPosition = useVerticalHandles ? Position.Top : Position.Left;
  const sourcePosition = useVerticalHandles ? Position.Bottom : Position.Right;

  // Hide handles: when floating OR when no edge connected
  const getHandleClass = (hasEdge: boolean) => {
    if (nodeData.isFloating || !hasEdge) {
      return '!h-0 !w-0 !opacity-0';
    }
    return '!h-2 !w-2 !border-0 !bg-violet-300';
  };

  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-xl px-5 py-3 shadow-lg transition-all duration-300',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
      style={{
        background: NODE_COLORS.trait.gradient,
        boxShadow: `0 4px 20px ${NODE_COLORS.trait.primary}40`,
      }}
    >
      <Handle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <div className="flex flex-col items-center">
        <span className="select-none font-semibold text-sm text-white capitalize">
          {nodeData.label.replace(/-/g, ' ')}
        </span>
        {nodeData.isLazimah && (
          <span className="mt-0.5 text-violet-200 text-xs">lazimah</span>
        )}
      </div>

      <Handle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </div>
  );
}

export function TraitNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as TraitNodeData;

  // Determine handle positions based on layout
  const useVerticalHandles =
    nodeData.layoutMode === 'radial' ||
    (nodeData.layoutMode === 'hierarchical' &&
      nodeData.hierarchyDirection === 'vertical');

  const targetPosition = useVerticalHandles ? Position.Top : Position.Left;
  const sourcePosition = useVerticalHandles ? Position.Bottom : Position.Right;

  // Hide handles: when floating OR when no edge connected
  const getHandleClass = (hasEdge: boolean) => {
    if (nodeData.isFloating || !hasEdge) {
      return '!h-0 !w-0 !opacity-0';
    }
    return '!h-2 !w-2 !border-0 !bg-violet-300';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  return (
    <div
      className={cn(
        'group relative flex items-center justify-center rounded-lg border-2 border-violet-400/50 bg-violet-500/20 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300',
        isActive
          ? 'scale-110 bg-violet-500/40'
          : 'hover:scale-105 hover:bg-violet-500/30',
        isDimmed && 'opacity-30',
        nodeData.isMiddleTrait && 'border-dashed',
      )}
    >
      <Handle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <div className="flex flex-col items-center">
        <span className="select-none font-medium text-violet-700 text-xs capitalize dark:text-violet-100">
          {nodeData.label.replace(/-/g, ' ')}
        </span>
        {nodeData.isMiddleTrait && (
          <span className="text-[10px] text-violet-500 dark:text-violet-300">
            middle
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </div>
  );
}
