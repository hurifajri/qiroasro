import { cn } from '@/lib/utils';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  color: string;
}

export function StatItem({ icon, value, color }: Readonly<StatItemProps>) {
  return (
    <li className="flex items-center gap-1.5">
      {icon}
      <span className={cn('text-sm font-bold tabular-nums', color)}>
        {value.toLocaleString()}
      </span>
    </li>
  );
}
