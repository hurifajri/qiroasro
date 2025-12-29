import { type NodeProps, Position } from '@xyflow/react';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { cn } from '@/lib/utils';
import type { Letter } from '@/schemas/letter';

type LetterNodeData = Letter & { status: string };

export function LetterQuizNode({ data }: NodeProps) {
  const nodeData = data as unknown as LetterNodeData;

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
      <BaseNodeContent className="flex select-none items-center justify-center gap-0 p-0 font-bold text-4xl text-node-letter-text">
        {nodeData.symbol}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={Position.Right}
        className={cn('size-4!', nodeData.isMadd ? 'bg-node-letter!' : 'bg-node-letter-madd!')}
      />
    </BaseNode>
  );
}
