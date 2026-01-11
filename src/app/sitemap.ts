import type { MetadataRoute } from 'next';
import { env } from '@/env';
import { getLocalePath } from '@/i18n/locale';
import { type Locale, routing } from '@/i18n/routing';
import { PAGES } from '@/lib/constants';

const APP_URL = env.NEXT_PUBLIC_APP_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${APP_URL}${getLocalePath(page, locale as Locale)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '/' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${APP_URL}${getLocalePath(page, l as Locale)}`,
          ]),
        ),
      },
    })),
  );
}
