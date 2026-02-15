import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserStatus } from '../_schemas/private';

interface StatusCardProps {
  statuses: UserStatus[];
}

export function StatusCard({ statuses }: StatusCardProps) {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('set_status')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2">
          {statuses.map((status) => (
            <Button
              key={status.label}
              className="size-10 text-xl"
              title={status.label}
              size="icon"
              variant="ghost"
            >
              {status.emoji}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
