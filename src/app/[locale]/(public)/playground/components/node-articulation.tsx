import type { NodeProps } from '@xyflow/react';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useState } from 'react';
import { BaseHandle } from '@/components/graph/base-handle';
import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { NodeAppendix } from '@/components/graph/node-appendix';
import { cn, kebabToSnakeCase, kebabToSpaced } from '@/lib/utils';
import type {
  ArticulationArea,
  ArticulationPoint,
} from '@/schemas/articulation';
import { useNodeLayout } from '../hooks/use-node-layout';
import type { BaseNodeData } from '../schemas/node';
import { NodeInfoDialog } from './node-info-dialog';

type ArticulationAreaNodeData = ArticulationArea & BaseNodeData;
type ArticulationPointNodeData = ArticulationPoint & BaseNodeData;

export const ArticulationAreaNode = memo(({ data, selected }: NodeProps) => {
  const t = useTranslations('global.articulation_area');
  const nodeData = data as ArticulationAreaNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = t(localeKey);

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-articulation-secondary!', selected);

  return (
    <BaseNode
      className={cn(
        'rounded-xl border-0 bg-linear-to-br from-node-articulation to-node-articulation-dark px-6 py-4 transition-transform duration-300 hover:ring-0',
        isActive ? 'scale-110' : 'hover:scale-105',
        isDimmed && 'opacity-30',
      )}
    >
      <BaseHandle
        type="target"
        position={targetPosition}
        className={getHandleClass(nodeData.hasTargetEdge ?? false)}
      />

      <BaseNodeContent className="select-none p-0 font-semibold text-node-letter-text text-sm capitalize">
        {label}
      </BaseNodeContent>

      <BaseHandle
        type="source"
        position={sourcePosition}
        className={getHandleClass(nodeData.hasSourceEdge ?? false)}
      />
    </BaseNode>
  );
});

export const ArticulationPointNode = memo(({ data, selected }: NodeProps) => {
  const t = useTranslations('global.articulation_point');
  const nodeData = data as ArticulationPointNodeData;
  const localeKey = kebabToSnakeCase(nodeData.slug);
  const label = kebabToSpaced(nodeData.slug);
  const description = t(localeKey);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { targetPosition, sourcePosition, getHandleClass, isActive, isDimmed } =
    useNodeLayout(nodeData, 'bg-node-articulation-secondary!', selected);

  return (
    <>
      <BaseNode
        className={cn(
          'rounded-lg border-2 border-node-articulation/50 bg-node-articulation/20 px-4 py-2 text-node-articulation-text transition-transform duration-300 hover:ring-0',
          isActive ? 'scale-110' : 'hover:scale-105',
          isDimmed && 'opacity-30',
          ['jauf'].includes(nodeData.slug) && 'border-dashed',
        )}
      >
        <NodeAppendix
          position="top"
          className="-right-2.5 top-3.5 w-auto rounded-full border-none p-0"
        >
          <CircleQuestionMarkIcon
            onClick={() => {
              setIsDialogOpen(true);
            }}
            className="nodrag size-5 cursor-pointer text-node-articulation/50"
          />
        </NodeAppendix>

        <BaseHandle
          type="target"
          position={targetPosition}
          className={getHandleClass(nodeData.hasTargetEdge ?? false)}
        />

        <BaseNodeContent className="select-none p-0 font-medium text-xs capitalize">
          {label}
        </BaseNodeContent>

        <BaseHandle
          type="source"
          position={sourcePosition}
          className={getHandleClass(nodeData.hasSourceEdge ?? false)}
        />
      </BaseNode>

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
