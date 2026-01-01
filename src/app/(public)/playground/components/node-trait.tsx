import type { NodeProps } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { NodeAppendix } from '@/components/graph/node-appendix';
import { cn, kebabToSnakeCase, kebabToSpaced } from '@/lib/utils';
import type { Trait, TraitGroup } from '@/schemas/trait';
import { useNodeLayout } from '../hooks/use-node-layout';
import type { BaseNodeData } from '../schemas/node';
import { NodeInfoDialog } from './node-info-dialog';

type TraitGroupNodeData = TraitGroup & BaseNodeData;
type TraitNodeData = Trait & BaseNodeData;

export function TraitGroupNode({ data, selected }: NodeProps) {
  const t = useTranslations('global.trait_group');
  const nodeData = data as TraitGroupNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(localeKey);

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } = useNodeLayout(
    nodeData,
    'bg-node-trait-secondary!',
    selected,
  );

  return (
    <BaseNode
      className={cn(
        'rounded-xl border-0 bg-linear-to-br from-node-trait to-node-trait-dark px-6 py-4 transition-all duration-300 hover:ring-0',
        isActive ? 'scale-110' : 'hover:scale-105',
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
  const t = useTranslations('global.trait');
  const nodeData = data as TraitNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = kebabToSpaced(nodeData.slug);
  const description = t(localeKey);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } = useNodeLayout(
    nodeData,
    'bg-node-trait-secondary!',
    selected,
  );

  return (
    <>
      <BaseNode
        className={cn(
          'rounded-lg border-2 border-node-trait/50 bg-node-trait/20 px-4 py-2 text-node-trait-text backdrop-blur-sm transition-all duration-300 hover:bg-node-trait/30 hover:ring-0',
          isActive ? 'scale-110' : 'hover:scale-105',
          isDimmed && 'opacity-30',
          ['tafkhim', 'tarqiq', 'others'].includes(nodeData.slug) && 'border-dashed',
        )}
      >
        <NodeAppendix
          position="top"
          className="-right-2.5 top-3.5 w-auto rounded-full border-none p-0"
        >
          <CircleQuestionMarkIcon
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="nodrag size-5 cursor-pointer text-node-trait/50"
          />
        </NodeAppendix>

        <BaseHandle
          type="target"
          position={targetPosition}
          className={getHandleClass(nodeData.hasTargetEdge ?? false)}
        />

        <BaseNodeContent className="flex select-none flex-col items-center p-0 font-medium text-xs capitalize">
          {label}
        </BaseNodeContent>

        <BaseHandle
          type="source"
          position={sourcePosition}
          className={getHandleClass(nodeData.hasSourceEdge ?? false)}
        />
      </BaseNode>

      {isDialogOpen && (
        <NodeInfoDialog
          label={label}
          description={description}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
