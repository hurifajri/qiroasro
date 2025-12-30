import { type NodeProps, Position } from '@xyflow/react';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { cn } from '@/lib/utils';

export type QuizMode = 'makhraj' | 'sifat';

type TargetQuizNodeData = {
  label: string;
  mode: QuizMode;
  status: 'none' | 'correct' | 'incorrect';
};

export function TargetQuizNode({ data }: NodeProps) {
  const nodeData = data as TargetQuizNodeData;

  return (
    <BaseNode
      className={cn(
        'rounded-lg border-2 px-4 py-2 backdrop-blur-sm transition-all duration-300',
        nodeData.mode === 'makhraj' &&
          'border-node-articulation/50 bg-node-articulation/20 text-node-articulation-text',
        nodeData.mode === 'sifat' && 'border-node-trait/50 bg-node-trait/20 text-node-trait-text',
      )}
    >
      <BaseHandle
        type="target"
        position={Position.Left}
        className={cn(
          'size-4!',
          nodeData.mode === 'makhraj' && 'bg-node-articulation-secondary!',
          nodeData.mode === 'sifat' && 'bg-node-trait-secondary!',
          nodeData.status === 'correct' && 'bg-green-500!',
          nodeData.status === 'incorrect' && 'bg-red-500!',
        )}
      />

      <BaseNodeContent className="select-none p-0 font-medium text-xs capitalize">
        {nodeData.label}
      </BaseNodeContent>
    </BaseNode>
  );
}
