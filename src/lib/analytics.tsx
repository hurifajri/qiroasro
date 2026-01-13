'use client';

import dynamic from 'next/dynamic';
import { env } from '@/env';

const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;

/**
 * Dynamically import PostHog to defer loading and reduce TBT.
 * ssr: false ensures it only loads on client after hydration.
 */
const PostHogLoader = dynamic(() => import('@/providers/posthog'), {
  ssr: false,
});

/**
 * Lazy load consent banner to defer until after initial hydration.
 * The banner is not critical for first paint.
 */
const ConsentBanner = dynamic(
  () =>
    import('@/components/common/consent-banner').then(
      (mod) => mod.ConsentBanner,
    ),
  { ssr: false },
);

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
    <PostHogLoader>
      <ConsentBanner />
      {children}
    </PostHogLoader>
  );
}

/**
 * Get PostHog instance lazily (only when needed).
 * Returns null if not in browser or PostHog is not configured.
 */
async function getPostHog() {
  if (typeof window === 'undefined' || !POSTHOG_KEY) {
    return null;
  }
  const posthog = (await import('posthog-js')).default;
  return posthog;
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
    getPostHog().then((posthog) => {
      posthog?.capture(eventName, properties);
    });
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
    getPostHog().then((posthog) => {
      posthog?.identify(userId, properties);
    });
  }
}

/**
 * Reset user identity (call on logout).
 */
export function resetUser() {
  if (typeof window !== 'undefined' && POSTHOG_KEY) {
    getPostHog().then((posthog) => {
      posthog?.reset();
    });
  }
}
