'use client';

import { CheckCircle2Icon, Loader2Icon, MailCheckIcon, MailIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { useWaitlist } from '@/hooks/use-waitlist';
import { cn } from '@/lib/utils';

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
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-block size-2 shrink-0 animate-pulse rounded-full bg-accent-amber text-lg" />
            <Label htmlFor="email">{t('development.reminder_title')}</Label>
          </div>
        )}
        {/* Reminder Form */}
        <form
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
                          id="email"
                          type="email"
                          placeholder="Email"
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
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 cursor-pointer bg-linear-to-r from-accent-violet to-accent-violet-dark px-6 text-base text-white shadow-accent-violet/25 shadow-lg transition-all hover:scale-[1.005] hover:shadow-accent-violet/30 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-28"
                >
                  {isSubmitting ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    t('development.reminder_cta')
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>

          {/* Status Message */}
          {!['idle', 'verified'].includes(waitlistStatus) && (
            <span
              className={cn(
                'flex items-center gap-2 text-sm transition-opacity duration-200',
                getStatusColor(),
              )}
            >
              {getStatusIcon()}
              {getStatusMessage()}
            </span>
          )}
        </form>
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
