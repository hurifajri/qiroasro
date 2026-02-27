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
  // Matcher: menentukan request mana yang dijalankan middleware-nya.
  // Request yang tidak match = middleware skip sepenuhnya (lebih cepat).
  // Kita exclude:
  // - api, trpc       → API routes tidak perlu cek locale/auth di middleware
  // - _next           → Next.js internal files
  // - _vercel         → Vercel internal files
  // - files with dot  → Static assets (favicon.ico, *.svg, *.png, dll)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
