'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useConsent } from '@/hooks/use-consent';
import { Link } from '@/i18n/navigation';

export function ConsentBanner() {
  const t = useTranslations('global.consent');
  const { hasConsented, acceptConsent, rejectConsent } = useConsent();

  // Don't show if already decided (accepted or rejected)
  const shouldShow = hasConsented === null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg sm:inset-x-auto sm:right-4 sm:left-auto"
        >
          <Card className="gap-0 border-border/50 bg-background/95 py-0 shadow-lg backdrop-blur-sm">
            <CardContent className="flex flex-col gap-4 px-4 pt-4">
              <p className="text-muted-foreground text-sm">
                {t('message')}{' '}
                <Link
                  href="/privacy"
                  className="text-primary underline underline-offset-4"
                >
                  {t('privacy_link')}
                </Link>
              </p>
            </CardContent>

            <CardFooter className="flex items-center gap-2 border-none bg-background/95">
              <Button
                variant="outline"
                size="sm"
                onClick={rejectConsent}
                className="flex-1"
              >
                {t('reject')}
              </Button>
              <Button size="sm" onClick={acceptConsent} className="flex-1">
                {t('accept')}
              </Button>
            </CardFooter>
          </Card>
        </m.div>
      )}
    </AnimatePresence>
  );
}
