import '@/styles/global.css';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata, Viewport } from 'next';
import { Noto_Naskh_Arabic, Outfit } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { env } from '@/env';
import { getLocaleDir } from '@/i18n/locale';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { MotionProvider } from '@/providers/motion';
import { QueryClientProvider } from '@/providers/query-client';
import { ThemeProvider } from '@/providers/theme';

type RootLayoutProps = React.PropsWithChildren & {
  params: Promise<{ locale: string }>;
};

const latinFont = Outfit({
  variable: '--font-latin',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const arabicFont = Noto_Naskh_Arabic({
  variable: '--font-arabic',
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

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const dir = getLocaleDir(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={cn(
          'font-latin antialiased',
          latinFont.variable,
          arabicFont.variable,
        )}
      >
        <QueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>
              <MotionProvider>{children}</MotionProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
          {/* {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="top-left"
              position="right"
            />
          )} */}
        </QueryClientProvider>
      </body>
    </html>
  );
}
