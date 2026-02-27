import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Public routes that DO NOT require authentication.
// Every other route will be considered private (default-deny pattern).
// Format: without locale prefix (e.g. '/login' not '/en/login')
const PUBLIC_ROUTES = [
  '/', // Landing page
  '/playground', // Public playground page
  '/login',
  '/register',
  '/forgot-password',
];

function isPublicRoute(pathname: string): boolean {
  // Strip the locale prefix from the pathname
  // e.g. /en -> /
  // e.g. /en/login -> /login
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/, '/');

  return PUBLIC_ROUTES.some((route) => {
    if (route === '/') {
      return withoutLocale === '/';
    }
    return withoutLocale.startsWith(route);
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Default-deny: If NOT logged in and routing to a NON-PUBLIC route -> redirect to login
  if (!user && !isPublicRoute(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    // Redirect to homepage (not /login) because there is no login page yet
    // TODO: Update to the correct login route after Task 1.5 (Login UI) is completed
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return supabaseResponse;
}
