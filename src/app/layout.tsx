import type { Metadata, Viewport } from 'next';
import { Google_Sans_Flex } from 'next/font/google';
import '@/styles/global.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextIntlClientProvider } from 'next-intl';
import { cn } from '@/lib/utils';
import { GlobalStoreProvider } from '@/providers/global';
import { QueryClientProvider } from '@/providers/query-client';
import { getPersistedGlobalStore } from '@/stores/global';

const googleSansFlex = Google_Sans_Flex({
  variable: '--font-google-sans-flex',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Qiroasro',
  description: 'Qiroasro',
};

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
      <body className={cn('font-sans antialiased', googleSansFlex.variable)}>
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
