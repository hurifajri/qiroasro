// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { env } from '@/env';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Session Replay for debugging crashes (especially mobile force closes)
  // https://docs.sentry.io/platforms/javascript/session-replay/
  integrations: [
    Sentry.replayIntegration({
      // Mask all text for privacy (can be adjusted)
      maskAllText: false,
      // Block all media for performance
      blockAllMedia: true,
    }),
  ],

  // Session Replay sampling rates
  // Capture 10% of sessions normally
  replaysSessionSampleRate: 0.1,
  // Capture 100% of sessions with errors (crucial for debugging crashes)
  replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
