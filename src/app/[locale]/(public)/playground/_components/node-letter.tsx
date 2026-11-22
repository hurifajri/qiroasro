import type { NodeProps } from '@xyflow/react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';

import { BaseHandle } from '@/components/graph/base-handle';
import { LetterNodeShell } from '@/components/graph/tajweed-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import { useNodeLayout } from '../_hooks/use-node-layout';
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
    <LetterNodeShell
      symbol={nodeData.symbol}
      label={label}
      tafkhimType={nodeData.tafkhimType}
      className={cn(
        'transition-transform duration-300',
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

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
        isConnectable={false}
      />
    </LetterNodeShell>
  );
});
