import { type NodeProps, Position } from '@xyflow/react';

import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { cn } from '@/lib/utils';

import { LETTER_TAFKHIM_GRADIENT } from '../_lib/letter';
import type { LetterQuizNodeData } from '../_schemas/node';

export function LetterQuizNode({ data }: NodeProps) {
  const nodeData = data as LetterQuizNodeData;

  return (
    <BaseNode
      className={cn(
        'flex size-16 items-center justify-center rounded-full border-0 hover:ring-0',
        'bg-linear-to-br',
        LETTER_TAFKHIM_GRADIENT[nodeData.tafkhimType],
      )}
    >
      <BaseNodeContent className="flex items-center justify-center gap-0 p-0 text-node-letter-text select-none">
        <span className="font-arabic text-4xl font-bold">
          {nodeData.symbol}
        </span>
      </BaseNodeContent>

      {/* Full-node handle for Easy Connect - entire node acts as connection handle */}
      <BaseHandle
        type="source"
        position={Position.Right}
        className="absolute! inset-0! h-full! w-full! transform-none! rounded-full! border-0! bg-transparent!"
      />
    </BaseNode>
  );
}
