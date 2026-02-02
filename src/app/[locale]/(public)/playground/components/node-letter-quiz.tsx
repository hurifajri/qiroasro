import { type NodeProps, Position } from '@xyflow/react';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { cn } from '@/lib/utils';
import type { LetterQuizNodeData } from '../schemas/node';

export function LetterQuizNode({ data }: NodeProps) {
  const nodeData = data as LetterQuizNodeData;

  return (
    <BaseNode
      className={cn(
        'flex size-16 items-center justify-center rounded-full border-0 hover:ring-0',
        nodeData.isMadd
          ? 'bg-linear-to-br from-node-letter-madd to-node-letter-madd-dark'
          : 'bg-linear-to-br from-node-letter to-node-letter-dark',
      )}
    >
      <BaseNodeContent className="flex select-none items-center justify-center gap-0 p-0 text-node-letter-text">
        <span className="font-arabic font-bold text-4xl">
          {nodeData.symbol}
        </span>
      </BaseNodeContent>

      {/* Full-node handle for Easy Connect - entire node acts as connection handle */}
      <BaseHandle
        type="source"
        position={Position.Right}
        className="absolute! transform-none! inset-0! h-full! w-full! rounded-full! border-0! bg-transparent!"
      />
    </BaseNode>
  );
}
