import type { NodeProps } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';
import type { Letter } from '@/schemas/letter';
import { useNodeLayout } from '../hooks/use-node-layout';
import type { BaseNodeData } from '../schemas/node';

type LetterNodeData = Letter & BaseNodeData;

export const LetterNode = memo(({ data, selected }: NodeProps) => {
  const t = useTranslations('global.letter');
  const nodeData = data as LetterNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = `(${t(localeKey)})`;

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-letter-handle!', selected);

  return (
    <BaseNode
      className={cn(
        'flex size-24 items-center justify-center rounded-full border-0 transition-transform duration-300 hover:ring-0',
        nodeData.isMadd
          ? 'bg-linear-to-br from-node-letter-madd to-node-letter-madd-dark'
          : 'bg-linear-to-br from-node-letter to-node-letter-dark',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
        isConnectable={false}
      />

      <BaseNodeContent className="flex select-none items-center justify-center gap-0 p-0 text-node-letter-text">
        <span className="font-bold text-4xl">{nodeData.symbol}</span>
        <span className="text-xs">{label}</span>
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
        isConnectable={false}
      />
    </BaseNode>
  );
});
