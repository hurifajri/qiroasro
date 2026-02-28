import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matcher: determines which requests the middleware runs on.
  // Unmatched requests = middleware skipped entirely (faster).
  // We exclude:
  // - api, trpc       → API routes don't need locale/auth checks in middleware
  // - _next           → Next.js internal files (including static and image)
  // - _vercel         → Vercel internal files
  // - files with dot  → Static assets (favicon.ico, *.svg, *.png, etc.)
  matcher:
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|.*\\..*).*)',
};
