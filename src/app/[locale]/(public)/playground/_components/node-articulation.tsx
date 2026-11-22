import type { NodeProps } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';

import { BaseHandle } from '@/components/graph/base-handle';
import { NodeAppendix } from '@/components/graph/node-appendix';
import {
  ArticulationAreaNodeShell,
  ArticulationPointNodeShell,
} from '@/components/graph/tajweed-node';
import { cn, kebabToSnakeCase } from '@/lib/utils';

import { useNodeLayout } from '../_hooks/use-node-layout';
import type {
  ArticulationArea,
  ArticulationPoint,
} from '../_schemas/articulation';
import type { BaseNodeData } from '../_schemas/node';
import { NodeInfoDialog } from './node-info-dialog';

type ArticulationAreaNodeData = ArticulationArea & BaseNodeData;
type ArticulationPointNodeData = ArticulationPoint & BaseNodeData;

export const ArticulationAreaNode = memo(function ArticulationAreaNode({
  data,
  selected,
}: NodeProps) {
  const t = useTranslations('global.articulation_area');
  const nodeData = data as ArticulationAreaNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(localeKey);

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-articulation-handle!', selected);

  return (
    <ArticulationAreaNodeShell
      label={label}
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
    </ArticulationAreaNodeShell>
  );
});

export const ArticulationPointNode = memo(function ArticulationPointNode({
  data,
  selected,
}: NodeProps) {
  const t = useTranslations('global');
  const nodeData = data as ArticulationPointNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(`articulation_point.${localeKey}`);
  const description = t(`articulation_point_description.${localeKey}`);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-articulation-handle!', selected);

  return (
    <>
      <ArticulationPointNodeShell
        label={label}
        isDashed={['jauf'].includes(nodeData.slug)}
        className={cn(
          'transition-transform duration-300',
          isActive ? 'scale-110' : 'hover:scale-105',
          isDimmed && 'opacity-30',
        )}
      >
        {isActive && (
          <NodeAppendix
            position="top"
            className="top-3.5 -right-2.5 w-auto rounded-full border-none bg-node-articulation-secondary p-0"
          >
            <CircleQuestionMarkIcon
              onClick={() => {
                setIsDialogOpen(true);
              }}
              className="nodrag animate-node-appendix-pulse size-5 cursor-pointer text-node-articulation/50 transition-transform"
            />
          </NodeAppendix>
        )}

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
      </ArticulationPointNodeShell>

      {isDialogOpen && (
        <NodeInfoDialog
          label={label}
          description={description}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
});
