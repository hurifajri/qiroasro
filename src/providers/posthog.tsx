'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { env } from '@/env';
import { useConsent } from '@/hooks/use-consent';

const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;

/**
 * PostHog provider component that initializes and manages PostHog.
 * Dynamically imported to reduce initial bundle size and defer loading.
 */
export default function PostHogLoader({ children }: React.PropsWithChildren) {
  const { hasConsented } = useConsent();

  useEffect(() => {
    if (!POSTHOG_KEY || !POSTHOG_HOST) return;

    // Initialize PostHog (always, but with opt-out by default)
    if (!posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // Manually capture based on consent
        capture_pageleave: false,
        persistence: 'localStorage',
        autocapture: false, // Disable until consent
        enable_recording_console_log: false,
        opt_out_capturing_by_default: true, // GDPR: opt-out by default
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        },
      });
    }

    // Handle consent state changes
    if (hasConsented === true) {
      posthog.opt_in_capturing();
      posthog.capture('$pageview'); // Capture initial pageview after consent
    } else if (hasConsented === false) {
      posthog.opt_out_capturing();
    }
    // hasConsented === null: waiting for user decision, keep opted out
  }, [hasConsented]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
