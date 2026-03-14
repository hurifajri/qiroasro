import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import type React from 'react';
import { PublicHeader } from '@/components/common/public-header';
import { env } from '@/env';
import { getAlternateOgLocale, getOgLocale } from '@/i18n/locale';
import { type Locale, routing } from '@/i18n/routing';
import { auth } from '@/lib/auth';

const APP_NAME = env.NEXT_PUBLIC_APP_NAME;
const APP_URL = env.NEXT_PUBLIC_APP_URL;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'global.metadata' });

  return {
    description: t('description'),
    keywords: t('keywords').split(','),
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      locale: getOgLocale(locale as Locale),
      alternateLocale: getAlternateOgLocale(locale as Locale),
      images: [
        { url: '/qiroasro-og.png', width: 1200, height: 630, alt: APP_NAME },
      ],
    },
    twitter: { card: 'summary_large_image', images: ['/qiroasro-og.png'] },
  };
}

export default async function PublicLayout({
  children,
}: React.PropsWithChildren) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'global.metadata' });

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  return (
    <>
      <PublicHeader userId={userId} />
      <main>{children}</main>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <safe>
        dangerouslySetInnerHTML={{
          // biome-ignore lint/style/useNamingConvention: <cant change this>
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: APP_NAME,
            url: APP_URL,
            applicationCategory: [
              'EducationalApplication',
              'ReferenceApplication',
            ],
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Organization',
              name: APP_NAME,
              url: APP_URL,
            },
            description: t('description'),
            featureList: t('feature_list').split(','),
            keywords: t('keywords'),
            inLanguage: locale,
            availableLanguage: routing.locales,
          }),
        }}
      />
    </>
  );
}
