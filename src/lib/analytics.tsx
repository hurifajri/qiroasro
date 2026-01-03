'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PhProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { env } from '@/env';

/**
 * PostHog API key from dashboard
 */
const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * PostHog host URL (default: https://app.posthog.com for US, https://eu.posthog.com for EU)
 */
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;

/**
 * Initialize PostHog client-side
 */
function PostHogInit() {
  useEffect(() => {
    if (POSTHOG_KEY && POSTHOG_HOST) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        // Privacy-friendly defaults
        persistence: 'localStorage',
        autocapture: true,
        // Session replay (free tier: 5k/month)
        enable_recording_console_log: false,
        // Disable in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        },
      });
    }
  }, []);

  return null;
}

/**
 * PostHog provider component.
 * Only initializes when environment variables are set.
 */
export function AnalyticsProvider({ children }: React.PropsWithChildren) {
  const isEnabled = POSTHOG_KEY && POSTHOG_HOST;

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <PhProvider client={posthog}>
      <PostHogInit />
      {children}
    </PhProvider>
  );
}

/**
 * Track a custom event using PostHog.
 * Safe to call even if PostHog is not loaded.
 *
 * @example
 * trackEvent('quiz_completed', { score: 85, difficulty: 'hard' });
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
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
export function identifyUser(userId: string, properties?: Record<string, unknown>) {
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
