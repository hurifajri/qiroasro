import type { NodeProps } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';

import { BaseHandle } from '@/components/graph/base-handle';
import { NodeAppendix } from '@/components/graph/node-appendix';
import {
  TraitGroupNodeShell,
  TraitNodeShell,
} from '@/components/graph/tajweed-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import { useNodeLayout } from '../hooks/use-node-layout';
import type { BaseNodeData } from '../schemas/node';
import type { Trait, TraitGroup } from '../schemas/trait';
import { NodeInfoDialog } from './node-info-dialog';

type TraitGroupNodeData = TraitGroup & BaseNodeData;
type TraitNodeData = Trait & BaseNodeData;

export const TraitGroupNode = memo(function TraitGroupNode({
  data,
  selected,
}: Readonly<NodeProps>) {
  const t = useTranslations('global.trait_group');
  const nodeData = data as TraitGroupNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(localeKey);
  const isInteractive = nodeData.isInteractive !== false;

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-trait-handle!', selected);

  return (
    <TraitGroupNodeShell
      label={label}
      className={cn(
        'transition-transform duration-300',
        isActive ? 'scale-110' : isInteractive && 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
        isConnectable={false}
      />

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
        isConnectable={false}
      />
    </TraitGroupNodeShell>
  );
});

export const TraitNode = memo(function TraitNode({
  data,
  selected,
}: Readonly<NodeProps>) {
  const t = useTranslations('global');
  const nodeData = data as TraitNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(`trait.${localeKey}`);
  const description = t(`trait_description.${localeKey}`);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isInteractive = nodeData.isInteractive !== false;

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-trait-handle!', selected);

  return (
    <>
      <TraitNodeShell
        label={label}
        isDashed={['tafkhim', 'tarqiq'].includes(nodeData.slug)}
        className={cn(
          'transition-transform duration-300',
          isActive ? 'scale-110' : isInteractive && 'hover:scale-105',
          isDimmed && 'opacity-30',
        )}
      >
        {isActive && isInteractive && (
          <NodeAppendix
            position="top"
            className="top-3.5 -right-2.5 w-auto rounded-full border-none bg-node-trait-secondary p-0"
          >
            <CircleQuestionMarkIcon
              onClick={() => {
                setIsDialogOpen(true);
              }}
              className="nodrag animate-node-appendix-pulse size-5 cursor-pointer text-node-trait/50 transition-transform"
            />
          </NodeAppendix>
        )}

        <BaseHandle
          type="target"
          position={targetPosition}
          className={getHandleClass(nodeData.hasTargetEdge ?? false)}
          isConnectable={false}
        />

        <BaseHandle
          type="source"
          position={sourcePosition}
          className={getHandleClass(nodeData.hasSourceEdge ?? false)}
          isConnectable={false}
        />
      </TraitNodeShell>

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
});
