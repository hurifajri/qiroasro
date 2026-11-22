import type { NodeProps } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import { useNodeLayout } from '../_hooks/use-node-layout';
import { LETTER_TAFKHIM_GRADIENT } from '../_lib/letter';
import type { Letter } from '../_schemas/letter';
import type { BaseNodeData } from '../_schemas/node';

type LetterNodeData = Letter & BaseNodeData;

export const LetterNode = memo(function LetterNode({
  data,
  selected,
}: NodeProps) {
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
        'bg-linear-to-br',
        LETTER_TAFKHIM_GRADIENT[nodeData.tafkhimType],
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

      <BaseNodeContent className="flex items-center justify-center gap-0 p-0 text-node-letter-text select-none">
        <span className="font-arabic text-4xl font-bold">
          {nodeData.symbol}
        </span>
        <span className="px-1 text-center text-xs leading-tight">{label}</span>
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
