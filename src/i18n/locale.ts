import { LOCALE_CONFIG } from './config';
import { type Locale, routing } from './routing';

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
 * Get path with locale prefix (respects localePrefix: 'always')
 */
export function getLocalePath(pathname: string, locale: Locale): string {
  // Always attach the locale prefix since we use localePrefix: 'always'
  const cleanPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const suffix = cleanPathname === '/' ? '' : cleanPathname;
  return `/${locale}${suffix}`;
}

/**
 * Get all locale paths for alternates metadata (includes x-default)
 */
export function getAlternateLanguages(
  pathname: string,
): Record<string, string> {
  // With localeDetection: true, the un-prefixed pathname acts as the language negotiator
  const cleanPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return {
    ...Object.fromEntries(
      routing.locales.map((l) => [l, getLocalePath(pathname, l)]),
    ),
    'x-default': cleanPathname, // points to the negotiation URL
  };
}
