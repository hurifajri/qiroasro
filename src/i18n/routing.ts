import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '@/i18n/config';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
  alternateLinks: true,
});
