import { type NodeProps, Position } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { NodeAppendix } from '@/components/graph/node-appendix';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { TargetQuizNodeData } from '../_schemas/node';
import { NodeInfoDialog } from './node-info-dialog';

export function TargetQuizNode({ data }: NodeProps) {
  const nodeData = data as TargetQuizNodeData;
  const t = useTranslations('global');
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(`${nodeData.type}.${localeKey}`);
  const description = t(`${nodeData.type}_description.${localeKey}`);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <BaseNode
        className={cn(
          'rounded-lg border-2 px-4 py-2 hover:ring-0',
          nodeData.type === 'articulation_point' &&
            'border-node-articulation/50 bg-node-articulation-secondary text-node-articulation-text',
          nodeData.type === 'trait' &&
            'border-node-trait/50 bg-node-trait-secondary text-node-trait-text',
        )}
      >
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
              'nodrag size-5 animate-node-appendix-pulse cursor-pointer transition-transform',
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
          className="absolute! transform-none! inset-0! h-full! w-full! rounded-lg! border-0! bg-transparent!"
        />

        <BaseNodeContent className="select-none p-0 font-medium text-xs capitalize">
          {label}
        </BaseNodeContent>
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
