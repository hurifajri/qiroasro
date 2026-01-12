'use client';

import { motion } from 'framer-motion';
import { RocketIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { WaitlistForm } from '@/components/common/waitlist-form';
import { UnderDevelopmentIllustration } from '@/components/illustrations/under-development';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from '@/i18n/navigation';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';

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
  const locale = useLocale();
  const router = useRouter();
  const theme = useGlobalStore((s) => s.theme);

  const handleClickExplore = () => {
    trackEvent('explore_playground_clicked', { locale, theme });
    router.push('/playground');
  };

  return (
    <motion.div
      className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 p-4 sm:mt-32 sm:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG Illustration */}
      <motion.div
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
      </motion.div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-12">
        <div className="flex flex-col items-start gap-4">
          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="bg-linear-to-r from-accent-violet via-accent-sky to-accent-amber bg-clip-text font-bold text-4xl text-transparent"
          >
            {t('development.title')}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground"
          >
            {t('development.subtitle')}
          </motion.p>

          {/* Playground Button */}
          <motion.button
            onClick={handleClickExplore}
            variants={itemVariants}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 cursor-pointer bg-linear-to-r from-accent-sky to-accent-sky-dark px-6 text-base text-white shadow-accent-sky/25 shadow-lg transition-all hover:shadow-accent-sky/30 hover:shadow-xl',
            )}
          >
            <RocketIcon className="size-5" />
            {t('development.playground_cta')}
          </motion.button>
        </div>

        {/* Waitlist Form */}
        <motion.div variants={itemVariants}>
          <WaitlistForm source="home_page" />
        </motion.div>
      </div>
    </motion.div>
  );
}
