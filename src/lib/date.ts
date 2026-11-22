import type { Locale as DateFnsLocale } from 'date-fns';
import { ar, enUS, id, ms, tr } from 'date-fns/locale';

import type { Locale } from '@/i18n/routing';

const DATE_LOCALE_MAP: Record<Locale, DateFnsLocale> = {
  id,
  en: enUS,
  tr,
  ms,
  ar,
};

/**
 * Get date-fns locale object for the given app locale
 */
export function getDateLocale(locale: Locale): DateFnsLocale {
  return DATE_LOCALE_MAP[locale];
}
