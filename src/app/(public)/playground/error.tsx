'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PlaygroundErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for the playground route.
 * Captures errors and reports them to Sentry with playground-specific context.
 */
export default function PlaygroundError({ error, reset }: PlaygroundErrorProps) {
  const t = useTranslations('playground_page.error');

  useEffect(() => {
    // Report error to Sentry with playground context
    Sentry.captureException(error, {
      tags: {
        component: 'playground',
        error_boundary: 'route',
      },
      extra: {
        digest: error.digest,
        pathname: window !== undefined ? window.location.pathname : undefined,
        userAgent: navigator !== undefined ? navigator.userAgent : undefined,
      },
    });
  }, [error]);

  return (
    <div className="flex h-[calc(100dvh-49px)] flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <h2 className="font-semibold text-foreground text-xl">{t('title')}</h2>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
        {error.digest && (
          <p className="mt-1 font-mono text-muted-foreground text-xs">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>{t('retry')}</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t('reload')}
        </Button>
      </div>
    </div>
  );
}
