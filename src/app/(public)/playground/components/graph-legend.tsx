import { ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const legends = [
  {
    keyName: 'articulation',
    color: 'from-node-articulation to-node-articulation-dark',
  },
  {
    keyName: 'trait',
    color: 'from-node-trait to-node-trait-dark',
  },
  {
    keyName: 'letter',
    color: 'from-node-letter to-node-letter-dark',
  },
  {
    keyName: 'letterMadd',
    color: 'from-node-letter-madd to-node-letter-madd-dark',
  },
];

export function GraphLegend() {
  const t = useTranslations('playground_page.legend');

  return (
    <Collapsible className="flex w-28 flex-col gap-2 rounded-lg border p-2 backdrop-blur-sm">
      <CollapsibleTrigger className="flex items-center justify-between gap-2 text-left font-semibold text-muted-foreground text-xs">
        {t('title')}
        <ChevronsUpDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
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
