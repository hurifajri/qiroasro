import { type NodeProps, Position } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { NodeAppendix } from '@/components/ui/graph/node-appendix';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { ArticulationArea, ArticulationPoint } from '@/schemas/articulation';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';

type ArticulationAreaNodeData = ArticulationArea & {
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};

type ArticulationPointNodeData = ArticulationPoint & {
  isFloating?: boolean;
  layoutMode?: LayoutMode;
  hierarchyDirection?: HierarchyDirection;
  hasSourceEdge?: boolean;
  hasTargetEdge?: boolean;
  isHighlighted?: boolean;
  isConnectedToSelected?: boolean;
  isDimmed?: boolean;
};

export function ArticulationAreaNode({ data, selected }: NodeProps) {
  const t = useTranslations('global.articulation_area');

  const nodeData = data as ArticulationAreaNodeData;

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
    return 'size-2 border-0! bg-node-articulation-secondary!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(localeKey);

  return (
    <BaseNode
      className={cn(
        'rounded-xl border-0 bg-linear-to-br from-node-articulation to-node-articulation-dark px-6 py-4 transition-all duration-300 hover:ring-0',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="select-none p-0 font-semibold text-node-letter-text text-sm capitalize">
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

export function ArticulationPointNode({ data, selected }: NodeProps) {
  const t = useTranslations('global.articulation_point');

  const nodeData = data as ArticulationPointNodeData;

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
    return 'size-2 border-0! bg-node-articulation-secondary!';
  };

  // Only dim nodes that are not selected and not highlighted
  const isActive = selected || nodeData.isHighlighted;
  const isDimmed = nodeData.isDimmed && !isActive;

  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = nodeData.slug.replace(/-/g, ' ');
  const description = t(localeKey);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <BaseNode
        className={cn(
          'rounded-lg border-2 border-node-articulation/50 bg-node-articulation/20 px-4 py-2 text-node-articulation-text backdrop-blur-sm transition-all duration-300 hover:bg-node-articulation/30 hover:ring-0',
          isActive ? 'scale-110' : 'hover:scale-105',
          isDimmed && 'opacity-30',
        )}
      >
        <NodeAppendix position="top" className="-right-1.5 top-3 w-auto border-none p-0">
          <CircleQuestionMarkIcon
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="size-4 cursor-pointer text-green-400"
          />
        </NodeAppendix>

        <BaseHandle
          type="target"
          position={targetPosition}
          className={getHandleClass(nodeData.hasTargetEdge ?? false)}
        />

        <BaseNodeContent className="select-none p-0 font-medium text-xs capitalize">
          {label}
        </BaseNodeContent>

        <BaseHandle
          type="source"
          position={sourcePosition}
          className={getHandleClass(nodeData.hasSourceEdge ?? false)}
        />
      </BaseNode>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2 capitalize">
              <CircleQuestionMarkIcon className="text-muted-foreground" />
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <p>{description}</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
