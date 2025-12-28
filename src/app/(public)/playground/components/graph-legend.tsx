import { ChevronsUpDown, CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ViewMode } from '@/schemas/graph';

interface GraphLegendProps {
  viewMode: ViewMode;
}

type Trait = 'traitLazimah' | 'traitAridhah';

export function GraphLegend({ viewMode }: GraphLegendProps) {
  const t = useTranslations('playground_page.legend');
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLegendId, setSelectedLegendId] = useState<Trait | null>(null);

  const legends = [
    ...(['all', 'articulation', 'letter'].includes(viewMode)
      ? [
          {
            id: 'articulationArea',
            label: t('articulation_area'),
            color: 'from-node-articulation to-node-articulation-dark',
          },
        ]
      : []),
    ...(['all', 'articulation', 'letter'].includes(viewMode)
      ? [
          {
            id: 'articulationPoint',
            label: t('articulation_point'),
            color: 'border-2 border-node-articulation/50 bg-node-articulation/20',
          },
        ]
      : []),
    ...(['all', 'trait', 'letter'].includes(viewMode)
      ? [
          {
            id: 'traitGroup',
            label: t('trait_group'),
            color: 'from-node-trait to-node-trait-dark',
          },
        ]
      : []),
    ...(['all', 'trait', 'letter'].includes(viewMode)
      ? [
          {
            id: 'traitLazimah',
            label: t('trait_lazimah'),
            color: 'border-2 border-node-trait/50 bg-node-trait/20',
            hasInfo: true,
          },
        ]
      : []),
    ...(['all', 'trait', 'letter'].includes(viewMode)
      ? [
          {
            id: 'traitAridhah',
            label: t('trait_aridhah'),
            color: 'border-2 border-dashed border-node-trait/50 bg-node-trait/20',
            hasInfo: true,
          },
        ]
      : []),
    {
      id: 'letter',
      label: t('letter'),
      color: 'from-node-letter to-node-letter-dark',
    },
    ...(['all', 'articulation', 'letter'].includes(viewMode)
      ? [
          {
            id: 'letterMadd',
            label: t('letterMadd'),
            color: 'from-node-letter-madd to-node-letter-madd-dark',
          },
        ]
      : []),
  ];

  const legendInfo: Record<Trait, { title: string; description: string }> = {
    traitLazimah: {
      title: t('trait_lazimah'),
      description: t('trait_lazimah_description'),
    },
    traitAridhah: {
      title: t('trait_aridhah'),
      description: t('trait_aridhah_description'),
    },
  };

  return (
    <>
      <Collapsible
        id="tour-graph-legend"
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex w-40 flex-col gap-2 rounded-lg border backdrop-blur-sm"
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
            {legends.map((legend, index) => (
              <li className="flex items-center gap-2" key={legend.id}>
                <div className={cn('size-4 rounded-full bg-linear-to-br', legend.color)} />
                <span className="flex flex-1 items-center justify-between text-muted-foreground text-xs">
                  {legend.label}
                  {legend.hasInfo && (
                    <CircleQuestionMarkIcon
                      id={
                        index === legends.findIndex((l) => l.hasInfo)
                          ? 'tour-trait-info'
                          : undefined
                      }
                      onClick={() => {
                        setSelectedLegendId(legend.id as Trait);
                        setIsDialogOpen(true);
                      }}
                      className="size-4 cursor-pointer text-muted-foreground"
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      {isDialogOpen && selectedLegendId && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2">
              <CircleQuestionMarkIcon className="text-muted-foreground" />
              <DialogTitle>{legendInfo[selectedLegendId].title}</DialogTitle>
            </DialogHeader>
            <p>{legendInfo[selectedLegendId].description}</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
