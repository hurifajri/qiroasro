'use client';

import { useForm } from '@tanstack/react-form';
import { useLocale, useTranslations } from 'next-intl';
import { emailRegex } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';

interface UseWaitlistOptions {
  source: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useWaitlist({ source, onSuccess, onError }: UseWaitlistOptions) {
  const t = useTranslations('global');
  const locale = useLocale();

  const waitlistStatus = useGlobalStore((s) => s.waitlistStatus);
  const setWaitlistStatus = useGlobalStore((s) => s.setWaitlistStatus);

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      try {
        setWaitlistStatus('idle');

        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: value.email, locale, source }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.message_code === 'already_verified') {
            setWaitlistStatus('already_verified');
          } else {
            setWaitlistStatus('error');
          }
          onError?.();
          return;
        }

        setWaitlistStatus('success');
        form.reset();
        onSuccess?.();
      } catch {
        setWaitlistStatus('error');
        onError?.();
      }
    },
  });

  function handleUrlParams(searchParams: URLSearchParams) {
    const status = searchParams.get('waitlist_status');
    if (status === 'success') {
      setWaitlistStatus('verified');
    } else if (status === 'already_verified') {
      setWaitlistStatus('already_verified');
    } else if (status === 'error') {
      setWaitlistStatus('error');
    }

    // Clear URL params after reading
    if (status) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('waitlist_status');
      newUrl.searchParams.delete('locale');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }

  function getStatusMessage(): string | null {
    switch (waitlistStatus) {
      case 'success':
        return t('development.reminder_success');
      case 'already_verified':
        return t('development.reminder_already_verified');
      case 'error':
        return t('development.reminder_error');
      default:
        return null;
    }
  }

  function getStatusColor(): string {
    switch (waitlistStatus) {
      case 'success':
      case 'verified':
      case 'already_verified':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return '';
    }
  }

  function validateEmail(value: string): string | undefined {
    if (!value) return t('development.reminder_email_required');
    if (!emailRegex.test(value)) return t('development.reminder_invalid_email');
    return undefined;
  }

  return {
    form,
    waitlistStatus,
    setWaitlistStatus,
    handleUrlParams,
    getStatusMessage,
    getStatusColor,
    validateEmail,
  };
}
