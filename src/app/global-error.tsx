'use client';

import NextError from 'next/error';

import { usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// type GlobalErrorProps = Readonly<{
//   error: Error & { digest?: string };
// }>;

export default function GlobalError() {
  const pathname = usePathname();

  // Extract locale from pathname (e.g., '/en/page' -> 'en')
  // Falls back to defaultLocale for paths like '/page' (no locale prefix)
  const pathSegment = pathname?.split('/')[1] ?? '';
  const locale = routing.locales.includes(
    pathSegment as (typeof routing.locales)[number],
  )
    ? pathSegment
    : routing.defaultLocale;

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
