import type { Metadata, Viewport } from 'next';
import { Amiri, Outfit } from 'next/font/google';
import '@/styles/global.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { env } from '@/env';
import { routing } from '@/i18n/routing';
import { AnalyticsProvider } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { GlobalStoreProvider } from '@/providers/global';
import { QueryClientProvider } from '@/providers/query-client';
import { getPersistedGlobalStore } from '@/stores/global';

const outfitFont = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const amiriFont = Amiri({
  variable: '--font-amiri',
  weight: ['400', '700'],
  subsets: ['arabic'],
});

const APP_NAME = env.NEXT_PUBLIC_APP_NAME;
const APP_URL = env.NEXT_PUBLIC_APP_URL;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('global.metadata');
  const locale = await getLocale();

  return {
    metadataBase: new URL(APP_URL),
    title: {
      template: `%s | ${APP_NAME}`,
      default: t('title'),
    },
    description: t('description'),
    keywords: [
      'tajweed',
      'tajwid',
      'makharijul huruf',
      'sifatul huruf',
      'quran',
      'arabic',
      'learn quran',
    ],
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? 'en_US' : 'id_ID',
      images: [
        { url: '/qiroasro-og.png', width: 1200, height: 630, alt: APP_NAME },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/qiroasro-og.png'],
    },
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
  maximumScale: 1,
  userScalable: true,
};

type RootLayoutProps = React.PropsWithChildren & {
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const persistedState = await getPersistedGlobalStore();
  const { theme } = persistedState;
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
        <AnalyticsProvider>
          <QueryClientProvider>
            <GlobalStoreProvider persistedState={persistedState}>
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </GlobalStoreProvider>
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="top-left"
                position="right"
              />
            )}
          </QueryClientProvider>
        </AnalyticsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
