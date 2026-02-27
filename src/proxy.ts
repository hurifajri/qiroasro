import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/proxy';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Auth: refresh session + protect private routes
  const authResponse = await updateSession(request);

  // If updateSession returned a redirect (unauthenticated on private route), stop here
  if (authResponse.status !== 200) {
    return authResponse;
  }

  // 2. i18n: handle locale routing
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
