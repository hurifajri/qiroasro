import { Flame, Shield, Trophy, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
}

const iconMap = {
  flame: Flame,
  zap: Zap,
  shield: Shield,
  trophy: Trophy,
};

export function StatCard({ label, value, icon }: StatCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap];

  // Determine if the stat is zero (inactive)
  const isInactive = value === 0;

  return (
    <Card
      size="sm"
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-4',
        isInactive && 'opacity-60',
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-primary" />}
        <span className="font-bold text-2xl">{value}</span>
      </div>
      <p className="text-center text-muted-foreground text-sm">{label}</p>
    </Card>
  );
}
