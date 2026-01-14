'use client';

import { RocketIcon } from 'lucide-react';
import * as m from 'motion/react-m';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * Lazy load heavy SVG illustration with Framer Motion animations.
 * This defers ~13KB of SVG code until after initial paint.
 */
const UnderDevelopmentIllustration = dynamic(
  () =>
    import('@/components/illustrations/under-development').then(
      (mod) => mod.UnderDevelopmentIllustration,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-auto w-full max-w-md animate-pulse rounded-lg bg-muted md:max-w-none"
        style={{ aspectRatio: '1920/1080' }}
      />
    ),
  },
);

/**
 * Lazy load WaitlistForm - appears below the fold, not critical for first paint.
 */
const WaitlistForm = dynamic(
  () =>
    import('@/components/common/waitlist-form').then((mod) => mod.WaitlistForm),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
    ),
  },
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export function Home() {
  const t = useTranslations('home_page');
  const router = useRouter();

  const handleClickExplore = () => {
    // trackEvent('explore_playground_clicked', { locale, theme });
    router.push('/playground');
  };

  return (
    <m.div
      className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 p-4 sm:mt-32 sm:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG Illustration */}
      <m.div
        variants={itemVariants}
        className="flex flex-1 shrink-0 items-center justify-center"
      >
        <Tooltip>
          <TooltipTrigger className="w-full">
            <UnderDevelopmentIllustration className="h-auto w-full max-w-md md:max-w-none" />
          </TooltipTrigger>
          <TooltipContent>
            <a
              href="https://iconscout.com/illustrations/designer"
              className="font-size-sm text-underline"
              target="_blank"
              rel="noopener"
            >
              designer&nbsp;
            </a>
            <a
              href="https://iconscout.com/contributors/delesign"
              className="font-size-sm text-underline"
            >
              Delesign Graphics&nbsp;
            </a>
            on&nbsp;
            <a
              href="https://iconscout.com"
              className="font-size-sm text-underline"
            >
              IconScout&nbsp;
            </a>
          </TooltipContent>
        </Tooltip>
      </m.div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-12">
        <div className="flex flex-col items-start gap-4">
          {/* Title */}
          <m.h2
            variants={itemVariants}
            className="bg-linear-to-r from-accent-violet via-accent-sky to-accent-amber bg-clip-text font-bold text-4xl text-transparent"
          >
            {t('development.title')}
          </m.h2>

          {/* Subtitle */}
          <m.p
            variants={itemVariants}
            className="text-lg text-muted-foreground"
          >
            {t('development.subtitle')}
          </m.p>

          {/* Playground Button */}
          <m.button
            onClick={handleClickExplore}
            variants={itemVariants}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 cursor-pointer bg-linear-to-r from-accent-sky to-accent-sky-dark px-6 text-base text-white shadow-accent-sky/25 shadow-lg transition-all hover:scale-[1.005] hover:shadow-accent-sky/30 hover:shadow-xl active:scale-95',
            )}
          >
            <RocketIcon className="size-5" />
            {t('development.playground_cta')}
          </m.button>
        </div>

        {/* Waitlist Form */}
        <m.div variants={itemVariants}>
          <WaitlistForm source="home_page" />
        </m.div>
      </div>
    </m.div>
  );
}
