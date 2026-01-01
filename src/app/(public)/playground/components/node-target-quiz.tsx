import { type NodeProps, Position } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { NodeAppendix } from '@/components/graph/node-appendix';
import { cn, kebabToSnakeCase, kebabToSpaced } from '@/lib/utils';
import type { TargetQuizNodeData } from '../schemas/node';
import { NodeInfoDialog } from './node-info-dialog';

export function TargetQuizNode({ data }: NodeProps) {
  const nodeData = data as TargetQuizNodeData;
  const t = useTranslations('global');
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = kebabToSpaced(nodeData.slug);
  const description = t(`${nodeData.mode}.${localeKey}`);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <BaseNode
        className={cn(
          'max-w-32 rounded-lg border-2 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:ring-0',
          nodeData.mode === 'articulation_point' &&
            'border-node-articulation/50 bg-node-articulation/20 text-node-articulation-text',
          nodeData.mode === 'trait' && 'border-node-trait/50 bg-node-trait/20 text-node-trait-text',
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
            className={cn(
              'nodrag size-5 cursor-pointer',
              nodeData.mode === 'trait' && 'text-node-trait/50',
              nodeData.mode === 'articulation_point' && 'text-node-articulation/50',
            )}
          />
        </NodeAppendix>

        <BaseHandle
          type="target"
          position={Position.Left}
          className={cn(
            'size-4!',
            nodeData.mode === 'articulation_point' && 'bg-node-articulation-secondary!',
            nodeData.mode === 'trait' && 'bg-node-trait-secondary!',
            nodeData.status === 'correct' && 'bg-green-500!',
            nodeData.status === 'incorrect' && 'bg-red-500!',
          )}
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
