import type { Locale } from './routing';
import { routing } from './routing';

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

/**
 * Get OpenGraph locale format (e.g., 'id_ID', 'en_US')
 */
export function getOgLocale(locale: Locale): string {
  return LOCALE_CONFIG[locale].ogLocale;
}

/**
 * Get text direction for the current locale (ltr or rtl)
 */
export function getLocaleDir(locale: Locale): 'ltr' | 'rtl' {
  return LOCALE_CONFIG[locale].dir;
}

/**
 * Get alternate OpenGraph locale for the current locale
 */
export function getAlternateOgLocale(locale: Locale): string {
  const alt =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  return LOCALE_CONFIG[alt].ogLocale;
}

/**
 * Get path with locale prefix (respects as-needed mode)
 */
export function getLocalePath(pathname: string, locale: Locale): string {
  return locale === routing.defaultLocale ? pathname : `/${locale}${pathname}`;
}

/**
 * Get all locale paths for alternates metadata (includes x-default)
 */
export function getAlternateLanguages(
  pathname: string,
): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((l) => [l, getLocalePath(pathname, l)]),
    ),
    'x-default': getLocalePath(pathname, 'en'),
  };
}
