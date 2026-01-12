import type { Locale } from './routing';
import { routing } from './routing';

/**
 * Locale metadata with emoji flags and display names
 */
export const LOCALE_CONFIG: Record<
  Locale,
  { flag: string; name: string; ogLocale: string }
> = {
  id: { flag: '🇮🇩', name: 'Indonesia', ogLocale: 'id_ID' },
  en: { flag: '🇺🇸', name: 'English', ogLocale: 'en_US' },
  tr: { flag: '🇹🇷', name: 'Türkçe', ogLocale: 'tr_TR' },
  // ms: { flag: '🇲🇾', name: 'Melayu', ogLocale: 'ms_MY' },
  // fr: { flag: '🇫🇷', name: 'Français', ogLocale: 'fr_FR' },
  // es: { flag: '🇪🇸', name: 'Español', ogLocale: 'es_ES' },
  // de: { flag: '🇩🇪', name: 'Deutsch', ogLocale: 'de_DE' },
  // nl: { flag: '🇳🇱', name: 'Nederlands', ogLocale: 'nl_NL' },
  // it: { flag: '🇮🇹', name: 'Italiano', ogLocale: 'it_IT' },
  // pt: { flag: '🇧🇷', name: 'Português', ogLocale: 'pt_BR' },
  // ru: { flag: '🇷🇺', name: 'Русский', ogLocale: 'ru_RU' },
  // sw: { flag: '🇹🇿', name: 'Kiswahili', ogLocale: 'sw_TZ' },
  // so: { flag: '🇸🇴', name: 'Soomaali', ogLocale: 'so_SO' },
  // ha: { flag: '🇳🇬', name: 'Hausa', ogLocale: 'ha_NG' },
  // ar: { flag: '🇸🇦', name: 'العربية', ogLocale: 'ar_SA' },
  // ur: { flag: '🇵🇰', name: 'اردو', ogLocale: 'ur_PK' },
  // fa: { flag: '🇮🇷', name: 'فارسی', ogLocale: 'fa_IR' },
  // bn: { flag: '🇧🇩', name: 'বাংলা', ogLocale: 'bn_BD' },
  // zh: { flag: '🇨🇳', name: '中文', ogLocale: 'zh_CN' },
  // hi: { flag: '🇮🇳', name: 'हिन्दी', ogLocale: 'hi_IN' },
  // ko: { flag: '🇰🇷', name: '한국어', ogLocale: 'ko_KR' },
};

/**
 * Get OpenGraph locale format (e.g., 'id_ID', 'en_US')
 */
export function getOgLocale(locale: Locale): string {
  return LOCALE_CONFIG[locale].ogLocale;
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
