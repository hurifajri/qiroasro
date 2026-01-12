'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PhProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { ConsentBanner } from '@/components/common/consent-banner';
import { env } from '@/env';
import { useConsent } from '@/hooks/use-consent';

/**
 * PostHog API key from dashboard
 */
const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * PostHog host URL (default: https://app.posthog.com for US, https://eu.posthog.com for EU)
 */
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;

/**
 * Initialize PostHog and handle consent changes
 */
function PostHogInit() {
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

  return null;
}

/**
 * PostHog provider component with consent management.
 * Only initializes when environment variables are set.
 * Renders ConsentBanner for GDPR/CCPA compliance.
 */
export function AnalyticsProvider({ children }: React.PropsWithChildren) {
  const isEnabled = Boolean(POSTHOG_KEY && POSTHOG_HOST);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <PhProvider client={posthog}>
      <PostHogInit />
      <ConsentBanner />
      {children}
    </PhProvider>
  );
}

/**
 * Track a custom event using PostHog.
 * Safe to call even if PostHog is not loaded or user hasn't consented.
 * Events are only captured if user has opted in.
 *
 * @example
 * trackEvent('quiz_completed', { score: 85, difficulty: 'hard' });
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.capture(eventName, properties);
  }
}

/**
 * Identify a user for tracking across sessions.
 * Call this when user logs in.
 *
 * @example
 * identifyUser('user-123', { email: 'user@example.com' });
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.identify(userId, properties);
  }
}

/**
 * Reset user identity (call on logout).
 */
export function resetUser() {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    posthog.reset();
  }
}
