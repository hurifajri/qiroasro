import type { Locale } from './routing';

export const LOCALES = [
  'id',
  'en',
  'tr',
  'ms',
  'ar',
  // 'fr',
  // 'es',
  // 'de',
  // 'nl',
  // 'it',
  // 'pt',
  // 'ru',
  // 'sw',
  // 'so',
  // 'ha',
  // 'ur',
  // 'fa',
  // 'bn',
  // 'zh',
  // 'hi',
  // 'ko',
] as const;

/**
 * Locale metadata with emoji flags and display names
 */
export const LOCALE_CONFIG: Record<
  Locale,
  { flag: string; name: string; ogLocale: string; dir: 'ltr' | 'rtl' }
> = {
  id: { flag: '🇮🇩', name: 'Indonesia', ogLocale: 'id_ID', dir: 'ltr' },
  en: { flag: '🇺🇸', name: 'English', ogLocale: 'en_US', dir: 'ltr' },
  tr: { flag: '🇹🇷', name: 'Türkçe', ogLocale: 'tr_TR', dir: 'ltr' },
  ms: { flag: '🇲🇾', name: 'Malay', ogLocale: 'ms_MY', dir: 'ltr' },
  ar: { flag: '🇸🇦', name: 'العربية', ogLocale: 'ar_SA', dir: 'rtl' },
};
