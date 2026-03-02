import type { MetadataRoute } from 'next';
import { env } from '@/env';
import { getLocalePath } from '@/i18n/locale';
import { type Locale, routing } from '@/i18n/routing';
import { PUBLIC_ROUTES } from '@/lib/routes';

const APP_URL = env.NEXT_PUBLIC_APP_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${APP_URL}${getLocalePath(page, locale as Locale)}`,
      lastModified: new Date('2026-01-12'),
      changeFrequency: 'weekly' as const,
      priority: page === '/' ? 1 : 0.8,
    })),
  );
}
