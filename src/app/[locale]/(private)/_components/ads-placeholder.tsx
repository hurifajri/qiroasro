import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdsPlaceholder() {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('ads.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Ad placeholder area */}
        <div className="flex min-h-50 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            {t('ads.placeholder')}
          </p>
        </div>

        {/* Remove ads button */}
        <Button variant="link">{t('ads.remove_ads')}</Button>
      </CardContent>
    </Card>
  );
}
