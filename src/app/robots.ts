import type { MetadataRoute } from 'next';
import { env } from '@/env';
import { routing } from '@/i18n/routing';
import { PRIVATE_ROUTES } from '@/lib/routes';

const APP_URL = env.NEXT_PUBLIC_APP_URL;

export default function robots(): MetadataRoute.Robots {
  // Generate disallow paths for all locales (e.g., /id/profile, /en/profile)
  const privatePaths = PRIVATE_ROUTES.flatMap((route) =>
    routing.locales.map((locale) => `/${locale}${route}`),
  );

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', ...privatePaths],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
