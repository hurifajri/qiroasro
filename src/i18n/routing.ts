import { defineRouting } from 'next-intl/routing';

import { type Locale, LOCALES } from '@/i18n/config';

export type { Locale };

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  alternateLinks: true,
});
