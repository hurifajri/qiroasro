'use client';

import { RocketIcon } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

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
      className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 p-4 sm:mt-32 sm:max-w-md sm:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
      </div>
    </m.div>
  );
}
