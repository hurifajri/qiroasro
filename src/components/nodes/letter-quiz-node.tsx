import { type NodeProps, Position } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { Letter } from '@/schemas/letter';

type LetterNodeData = Letter & { status: string };

export function LetterQuizNode({ data }: NodeProps) {
  const t = useTranslations('global.letter');

  const nodeData = data as unknown as LetterNodeData;

  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = `(${t(localeKey)})`;

  console.log('nodeData', nodeData);

  return (
    <BaseNode
      className={cn(
        'flex size-24 items-center justify-center rounded-full border-0 shadow-lg transition-all duration-300 hover:ring-0',
        nodeData.isMadd
          ? 'bg-linear-to-br from-node-letter-madd to-node-letter-madd-dark'
          : 'bg-linear-to-br from-node-letter to-node-letter-dark',
      )}
    >
      <BaseNodeContent className="flex select-none items-center justify-center gap-0 p-0 text-node-letter-text">
        <span className="font-bold text-4xl">{nodeData.symbol}</span>
        <span className="text-xs">{label}</span>
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={Position.Right}
        className={cn('size-4! bg-node-letter-secondary!')}
      />
    </BaseNode>
  );
}
