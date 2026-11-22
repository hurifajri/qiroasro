import { Flame, Shield, Trophy, Zap } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
}

const iconMap = {
  flame: Flame,
  zap: Zap,
  shield: Shield,
  trophy: Trophy,
};

export function StatCard({ label, value, icon }: Readonly<StatCardProps>) {
  const Icon = iconMap[icon as keyof typeof iconMap];

  // Determine if the stat is zero (inactive)
  const isActive = (value || 0) !== 0;

  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <Icon
          className={cn(
            'size-8',
            isActive ? 'text-primary' : 'text-muted-foreground',
          )}
        />
        <div className="flex flex-col">
          <p
            className={cn(
              'text-lg font-bold',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {value === '' ? '-' : value}
          </p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
