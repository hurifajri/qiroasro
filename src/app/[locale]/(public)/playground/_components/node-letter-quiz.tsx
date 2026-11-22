import { type NodeProps, Position } from '@xyflow/react';

import { BaseHandle } from '@/components/graph/base-handle';
import { LetterNodeShell } from '@/components/graph/tajweed-node';

import type { LetterQuizNodeData } from '../_schemas/node';

export function LetterQuizNode({ data }: NodeProps) {
  const nodeData = data as LetterQuizNodeData;

  return (
    <LetterNodeShell
      symbol={nodeData.symbol}
      tafkhimType={nodeData.tafkhimType}
      size="sm"
    >
      {/* Full-node handle for Easy Connect - entire node acts as connection handle */}
      <BaseHandle
        type="source"
        position={Position.Right}
        className="absolute! inset-0! h-full! w-full! transform-none! rounded-full! border-0! bg-transparent!"
      />
    </LetterNodeShell>
  );
}
