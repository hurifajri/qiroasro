import { type NodeProps, Position } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { BaseHandle } from '@/components/graph/base-handle';
import { NodeAppendix } from '@/components/graph/node-appendix';
import {
  ArticulationPointNodeShell,
  TraitNodeShell,
} from '@/components/graph/tajweed-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import type { TargetQuizNodeData } from '../schemas/quiz';
import { NodeInfoDialog } from './node-info-dialog';

export function TargetQuizNode({ data }: NodeProps) {
  const nodeData = data as TargetQuizNodeData;
  const t = useTranslations('global');
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(`${nodeData.type}.${localeKey}`);
  const description = t(`${nodeData.type}_description.${localeKey}`);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const ShellComponent =
    nodeData.type === 'articulation_point'
      ? ArticulationPointNodeShell
      : TraitNodeShell;

  return (
    <>
      <ShellComponent label={label}>
        <NodeAppendix
          position="top"
          className={cn(
            'top-3.5 -right-2.5 w-auto rounded-full border-none p-0',
            nodeData.type === 'trait' && 'bg-node-trait-secondary',
            nodeData.type === 'articulation_point' &&
              'bg-node-articulation-secondary',
          )}
        >
          <CircleQuestionMarkIcon
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className={cn(
              'nodrag animate-node-appendix-pulse size-5 cursor-pointer transition-transform',
              nodeData.type === 'trait' && 'text-node-trait/50',
              nodeData.type === 'articulation_point' &&
                'text-node-articulation/50',
            )}
          />
        </NodeAppendix>

        {/* Full-node handle for Easy Connect - entire node acts as connection handle */}
        <BaseHandle
          type="target"
          position={Position.Left}
          className="absolute! inset-0! h-full! w-full! transform-none! rounded-lg! border-0! bg-transparent!"
        />
      </ShellComponent>

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
