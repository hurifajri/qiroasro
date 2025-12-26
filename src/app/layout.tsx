import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import '@/styles/global.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { GlobalStoreProvider } from '@/providers/global';
import { QueryClientProvider } from '@/providers/query-client';
import { getPersistedGlobalStore } from '@/stores/global';

const outfitFont = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
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
      images: [{ url: '/qiroasro-og.png', width: 1200, height: 630, alt: APP_NAME }],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const persistedState = await getPersistedGlobalStore();
  const { locale, theme } = persistedState;

  return (
    <html lang={locale} className={theme} style={{ colorScheme: theme }} suppressHydrationWarning>
      <body className={cn('font-sans antialiased', outfitFont.variable)}>
        <QueryClientProvider>
          <GlobalStoreProvider initialState={persistedState}>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </GlobalStoreProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
              position="right"
            />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
