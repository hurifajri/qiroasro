import { Position } from '@xyflow/react';
import { BaseHandle } from '@/components/ui/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/ui/graph/base-node';
import { cn } from '@/lib/utils';

export type QuizMode = 'makhraj' | 'sifat';

interface TargetQuizNodeProps {
  data: { label: string; mode: QuizMode; hasConnection: boolean; isCorrectTarget: boolean };
}

export function TargetQuizNode({ data }: TargetQuizNodeProps) {
  return (
    <BaseNode
      className={cn(
        'rounded-lg border-2 px-4 py-2 backdrop-blur-sm transition-all duration-300',
        data.mode === 'makhraj' &&
          'border-node-articulation/50 bg-node-articulation/20 text-node-articulation-text',
        data.mode === 'sifat' && 'border-node-trait/50 bg-node-trait/20 text-node-trait-text',
      )}
    >
      <BaseHandle
        type="target"
        position={Position.Left}
        className={cn(
          'size-4!',
          data.mode === 'makhraj' && 'bg-node-articulation-secondary!',
          data.mode === 'sifat' && 'bg-node-trait-secondary!',
          data.hasConnection && data.isCorrectTarget && 'bg-green-500!',
          data.hasConnection && !data.isCorrectTarget && 'bg-red-500!',
        )}
      />

      <BaseNodeContent className="select-none p-0 font-medium text-xs capitalize">
        {data.label}
      </BaseNodeContent>
    </BaseNode>
  );
}
