import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '@/i18n/config';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'id',
  localePrefix: 'always',
  localeDetection: true,
  alternateLinks: true,
});

export type Locale = (typeof routing.locales)[number];
