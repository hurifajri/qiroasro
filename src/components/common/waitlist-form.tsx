'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2Icon, Loader2Icon, MailCheckIcon, MailIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useWaitlist } from '@/hooks/use-waitlist';
import { cn } from '@/lib/utils';

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

interface WaitlistFormProps {
  source: string;
  className?: string;
  showTitle?: boolean;
}

export function WaitlistForm({ source, className, showTitle = false }: WaitlistFormProps) {
  const t = useTranslations('home_page');
  const searchParams = useSearchParams();

  const { form, waitlistStatus, handleUrlParams, getStatusMessage, getStatusColor, validateEmail } =
    useWaitlist({ source });

  // Handle URL params from verification redirect
  useEffect(() => {
    handleUrlParams(searchParams);
  }, [searchParams, handleUrlParams]);

  const getStatusIcon = () => {
    switch (waitlistStatus) {
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

  return (
    <>
      <div className={cn('flex flex-col gap-2', className)}>
        {/* Title */}
        {showTitle && (
          <motion.div
            className="flex items-center gap-4 text-muted-foreground"
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
        )}

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
                onSubmit: ({ value }) => validateEmail(value),
              }}
            >
              {(field) => (
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <div className="relative flex flex-1 flex-col gap-1 sm:max-w-3xs">
                      <InputGroup
                        className={cn(
                          'h-12',
                          field.state.meta.errors.length > 0 && 'border-red-500',
                        )}
                      >
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
                          className="h-12 placeholder:text-muted-foreground"
                          disabled={isSubmitting}
                        />
                      </InputGroup>
                      {field.state.meta.errors.length > 0 && (
                        <p className="-bottom-6 absolute text-red-500 text-sm">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </form.Subscribe>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <motion.button
                  type="submit"
                  whileHover={{ scale: isSubmitting ? 1 : 1.005 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  disabled={isSubmitting}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-12 cursor-pointer bg-linear-to-r from-accent-violet to-accent-violet-dark px-6 text-base text-white shadow-accent-violet/25 shadow-lg transition-all hover:shadow-accent-violet/30 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:w-28',
                  )}
                >
                  {isSubmitting ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    t('development.reminder_cta')
                  )}
                </motion.button>
              )}
            </form.Subscribe>
          </div>

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {!['idle', 'verified'].includes(waitlistStatus) && (
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

      {/* Verification Success Dialog */}
      {waitlistStatus === 'verified' && (
        <Dialog>
          <DialogContent className="border border-lime-500">
            <DialogHeader className="flex flex-row items-center gap-2">
              <MailCheckIcon className="text-lime-600" />
              <DialogTitle className="font-semibold text-lg">
                {t('development.reminder_verified')}
              </DialogTitle>
            </DialogHeader>
            <p>{t('development.reminder_verified_message')}</p>
            <DialogFooter>
              <Link
                href="/playground"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 cursor-pointer bg-linear-to-r from-lime-500 to-lime-600 px-6 text-base text-white',
                )}
              >
                {t('development.playground_dialog_cta')}
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
