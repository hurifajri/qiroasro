import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const t = useTranslations('global.legend');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-foreground text-xs">Legenda</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 backdrop-blur-sm">
          {legends.map((legend) => (
            <li className="flex items-center gap-2" key={legend.keyName}>
              <div className={cn('size-4 rounded-full bg-linear-to-br', legend.color)} />
              <span className="text-foreground text-xs">{t(legend.keyName)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
