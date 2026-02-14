import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdsPlaceholder() {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="font-bold text-sm">{t('ads.title')}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Ad placeholder area */}
        <div className="flex min-h-50 items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/50">
          <p className="text-muted-foreground text-xs">
            {t('ads.placeholder')}
          </p>
        </div>

        {/* Remove ads button */}
        <Button variant="link" className="px-0 font-semibold text-primary">
          {t('ads.remove_ads')}
        </Button>
      </CardContent>
    </Card>
  );
}
