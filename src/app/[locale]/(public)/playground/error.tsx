'use client';

import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PlaygroundErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PlaygroundError({
  error,
  reset,
}: PlaygroundErrorProps) {
  const t = useTranslations('playground_page.error');

  return (
    <div className="flex h-[calc(100dvh-49px)] flex-col items-center justify-center p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1 font-semibold text-foreground text-xl">
            <TriangleAlertIcon />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="min-w-sm">
          {error.digest && (
            <p className="mt-1 font-mono text-muted-foreground text-xs">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-2">
          <Button onClick={reset}>{t('retry')}</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('reload')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
