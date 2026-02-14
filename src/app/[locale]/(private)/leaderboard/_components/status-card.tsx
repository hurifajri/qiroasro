import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserStatus } from '../_schemas/leaderboard';

interface StatusCardProps {
  statuses: UserStatus[];
}

export function StatusCard({ statuses }: StatusCardProps) {
  const t = useTranslations('leaderboard_page');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="font-bold">{t('set_status')}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2">
          {statuses.map((status) => (
            <button
              key={status.label}
              type="button"
              className="flex size-10 items-center justify-center rounded-lg text-xl transition-transform hover:scale-110 hover:bg-muted"
              title={status.label}
            >
              {status.emoji}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
