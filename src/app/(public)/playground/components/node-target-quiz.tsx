import { type NodeProps, Position } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { TargetQuizNodeData } from '../schemas/node';

export function TargetQuizNode({ data }: NodeProps) {
  const nodeData = data as TargetQuizNodeData;
  const t = useTranslations('global');
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const _label = t(`${nodeData.mode}.${localeKey}`);

  return (
    <BaseNode
      className={cn(
        'rounded-lg border-2 px-4 py-2 backdrop-blur-sm transition-all duration-300',
        nodeData.mode === 'articulation_point' &&
          'border-node-articulation/50 bg-node-articulation/20 text-node-articulation-text',
        nodeData.mode === 'trait' && 'border-node-trait/50 bg-node-trait/20 text-node-trait-text',
      )}
    >
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
        {nodeData.slug}
      </BaseNodeContent>
    </BaseNode>
  );
}
