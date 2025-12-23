import { ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { ViewMode } from '@/schemas/graph';

interface GraphLegendProps {
  viewMode: ViewMode;
}

export function GraphLegend({ viewMode }: GraphLegendProps) {
  const t = useTranslations('playground_page.legend');
  const [isOpen, setIsOpen] = useState(true);

  const legends = [
    ...(['all', 'articulation', 'letter'].includes(viewMode)
      ? [
          {
            keyName: 'articulation_area',
            color: 'from-node-articulation to-node-articulation-dark',
          },
        ]
      : []),
    ...(['all', 'articulation', 'letter'].includes(viewMode)
      ? [
          {
            keyName: 'articulation_point',
            color: 'border-2 border-node-articulation/50 bg-node-articulation/20',
          },
        ]
      : []),
    ...(['all', 'trait', 'letter'].includes(viewMode)
      ? [
          {
            keyName: 'trait_group',
            color: 'from-node-trait to-node-trait-dark',
          },
        ]
      : []),
    ...(['all', 'trait', 'letter'].includes(viewMode)
      ? [
          {
            keyName: 'trait_lazimah',
            color: 'border-2 border-node-trait/50 bg-node-trait/20',
          },
        ]
      : []),
    ...(['all', 'trait', 'letter'].includes(viewMode)
      ? [
          {
            keyName: 'trait_aridhah',
            color: 'border-2 border-dashed border-node-trait/50 bg-node-trait/20',
          },
        ]
      : []),
    {
      keyName: 'letter',
      color: 'from-node-letter to-node-letter-dark',
    },
    ...(['all', 'articulation', 'letter'].includes(viewMode)
      ? [
          {
            keyName: 'letterMadd',
            color: 'from-node-letter-madd to-node-letter-madd-dark',
          },
        ]
      : []),
  ];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-36 flex-col gap-2 rounded-lg border backdrop-blur-sm"
    >
      <CollapsibleTrigger
        className={cn(
          'flex items-center justify-between gap-2 p-2 text-left font-semibold text-muted-foreground text-xs',
          isOpen ? 'border-b' : '',
        )}
      >
        {t('title')}
        <ChevronsUpDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2 pt-0">
        <ul className="flex flex-col gap-2">
          {legends.map((legend) => (
            <li className="flex items-center gap-2" key={legend.keyName}>
              <div className={cn('size-4 rounded-full bg-linear-to-br', legend.color)} />
              <span className="text-muted-foreground text-xs">{t(legend.keyName)}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
