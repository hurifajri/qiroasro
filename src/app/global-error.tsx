'use client';

import NextError from 'next/error';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { routing } from '@/i18n/routing';

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
}>;

export default function GlobalError({ error }: GlobalErrorProps) {
  const pathname = usePathname();

  // Extract locale from pathname (e.g., '/en/page' -> 'en')
  // Falls back to defaultLocale for paths like '/page' (no locale prefix)
  const pathSegment = pathname?.split('/')[1] ?? '';
  const locale = routing.locales.includes(
    pathSegment as (typeof routing.locales)[number],
  )
    ? pathSegment
    : routing.defaultLocale;

  useEffect(() => {
    console.error('Global Error', error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
