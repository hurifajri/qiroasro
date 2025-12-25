'use client';

import { useForm } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, Loader2Icon, MailIcon, RocketIcon, XCircleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { UnderDevelopmentIllustration } from '@/components/illustrations/under-development';
import { buttonVariants } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = 'idle' | 'success' | 'verified' | 'already_verified' | 'error';

export default function HomePage() {
  const t = useTranslations('home_page');
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  // Handle URL params from verification redirect
  useEffect(() => {
    const status = searchParams.get('waitlist_status');
    if (status === 'success') {
      setSubmitStatus('verified'); // From verification link click
    } else if (status === 'already_verified') {
      setSubmitStatus('already_verified');
    } else if (status === 'error') {
      setSubmitStatus('error');
    }

    // Clear URL params after reading
    if (status) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('waitlist_status');
      newUrl.searchParams.delete('waitlist_message');
      newUrl.searchParams.delete('locale');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitStatus('idle');

        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: value.email,
            locale,
            source: 'homepage',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.code === 'ALREADY_VERIFIED') {
            setSubmitStatus('already_verified');
          } else {
            setSubmitStatus('error');
          }
          return;
        }

        setSubmitStatus('success');
        form.reset();
      } catch {
        setSubmitStatus('error');
      }
    },
  });

  const handleClickExplore = () => {
    router.push('/playground');
  };

  const getStatusMessage = () => {
    switch (submitStatus) {
      case 'success':
        return t('development.reminder_success');
      case 'verified':
        return t('development.reminder_verified');
      case 'already_verified':
        return t('development.reminder_already_verified');
      case 'error':
        return t('development.reminder_error');
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (submitStatus) {
      case 'success':
      case 'verified':
      case 'already_verified':
        return <CheckCircle2Icon className="size-4" />;
      case 'error':
        return <XCircleIcon className="size-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (submitStatus) {
      case 'success':
      case 'verified':
      case 'already_verified':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
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
              <a href="https://iconscout.com" className="font-size-sm text-underline">
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
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
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

          <div className="flex flex-col gap-2">
            {/* Additional decorative elements */}
            <motion.div
              className="flex items-center gap-2 text-muted-foreground"
              variants={itemVariants}
            >
              <motion.span
                className="inline-block size-2 shrink-0 rounded-full bg-accent-amber text-lg"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              />
              {t('development.reminder_title')}
            </motion.div>

            {/* Reminder Form */}
            <motion.form
              variants={itemVariants}
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <form.Field
                  name="email"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value) {
                        return t('development.reminder_email_required');
                      }
                      if (!emailRegex.test(value)) {
                        return t('development.reminder_invalid_email');
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="flex flex-1 flex-col gap-1 sm:max-w-3xs">
                      <InputGroup className="h-12">
                        <InputGroupAddon>
                          <MailIcon className="size-5 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder="Email"
                          type="email"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={cn(
                            'h-12 placeholder:text-muted-foreground',
                            field.state.meta.errors.length > 0 &&
                              'border-red-500 focus:ring-red-500',
                          )}
                          disabled={form.state.isSubmitting}
                        />
                      </InputGroup>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                <motion.button
                  type="submit"
                  whileHover={{ scale: form.state.isSubmitting ? 1 : 1.005 }}
                  whileTap={{ scale: form.state.isSubmitting ? 1 : 0.95 }}
                  disabled={form.state.isSubmitting}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-12 cursor-pointer bg-linear-to-r from-accent-violet to-accent-violet-dark px-6 text-base text-white shadow-accent-violet/25 shadow-lg transition-all hover:shadow-accent-violet/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70',
                  )}
                >
                  {form.state.isSubmitting ? (
                    <>
                      <Loader2Icon className="size-5 animate-spin" />
                      {t('development.reminder_submitting')}
                    </>
                  ) : (
                    t('development.reminder_cta')
                  )}
                </motion.button>
              </div>

              {/* Status Message */}
              <AnimatePresence mode="wait">
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn('flex items-center gap-2 text-sm', getStatusColor())}
                  >
                    {getStatusIcon()}
                    {getStatusMessage()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </>
  );
}
