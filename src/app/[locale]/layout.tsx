import type { Metadata, Viewport } from 'next';
import { Amiri, Outfit } from 'next/font/google';
import '@/styles/global.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { env } from '@/env';
import { getAlternateOgLocale, getOgLocale } from '@/i18n/locale';
import { type Locale, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { GlobalStoreProvider } from '@/providers/global';
import { MotionProvider } from '@/providers/motion';
import { QueryClientProvider } from '@/providers/query-client';
import { getPersistedGlobalStore } from '@/stores/global';

type RootLayoutProps = React.PropsWithChildren & {
  params: Promise<{ locale: string }>;
};

const outfitFont = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const amiriFont = Amiri({
  variable: '--font-amiri',
  weight: ['400', '700'],
  subsets: ['arabic'],
  display: 'swap',
  preload: true,
});

const APP_NAME = env.NEXT_PUBLIC_APP_NAME;
const APP_URL = env.NEXT_PUBLIC_APP_URL;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'global.metadata' });

  return {
    metadataBase: new URL(APP_URL),
    title: { template: `%s | ${APP_NAME}`, default: t('title') },
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
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const persistedState = await getPersistedGlobalStore();
  const { theme } = persistedState;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'global.metadata' });

  return (
    <html
      lang={locale}
      className={theme}
      style={{ colorScheme: theme }}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'font-sans antialiased',
          outfitFont.variable,
          amiriFont.variable,
        )}
      >
        <QueryClientProvider>
          <GlobalStoreProvider persistedState={persistedState}>
            <NextIntlClientProvider>
              <MotionProvider>{children}</MotionProvider>
            </NextIntlClientProvider>
          </GlobalStoreProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="top-left"
              position="right"
            />
          )}
        </QueryClientProvider>

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
      </body>
    </html>
  );
}
