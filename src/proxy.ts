import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { auth } from '@/lib/auth';
import { PRIVATE_ROUTES } from '@/lib/routes';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Checks if the given pathname (without locale prefix) matches a private route.
 * e.g. '/id/learn' → '/learn' → matches PRIVATE_ROUTES
 */
function isPrivateRoute(pathname: string): boolean {
  // Strip locale prefix: /en/learn → /learn, /id/settings → /settings
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  return PRIVATE_ROUTES.some(
    (route) => withoutLocale === route || withoutLocale.startsWith(`${route}/`),
  );
}

export default async function middleware(
  request: NextRequest,
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const preservedLocale = pathname.match(/^\/([a-z]{2})\//)?.[1];
  const locale = preservedLocale ?? routing.defaultLocale;
  const isLoginPage = /^(?:\/[a-z]{2})?\/login$/.test(pathname);

  // Check auth only for private routes to avoid unnecessary session lookups
  if (isPrivateRoute(pathname)) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      // Redirect unauthenticated users to /login (preserving locale)
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from /login
  if (isLoginPage) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      return NextResponse.redirect(new URL(`/${locale}/learn`, request.url));
    }
  }

  // Run next-intl middleware for locale handling on all other routes
  return intlMiddleware(request);
}

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
