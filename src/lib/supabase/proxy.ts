import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Routes that require authentication — update if new routes are added
// Format: without locale prefix (e.g. '/learn' not '/en/learn')
const PRIVATE_ROUTE_SEGMENTS = [
  '/learn',
  '/practice',
  '/sections',
  '/reference',
  '/profile',
  '/settings',
  '/leaderboard',
  '/quests',
  '/shop',
];

function isPrivateRoute(pathname: string): boolean {
  // Pathname will be formatted as /{locale}/... because next-intl uses localePrefix: 'always'
  // Example: /en/learn, /id/settings, /en/profile/johndoe
  // We strip the first segment (locale) then check the rest
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
  return PRIVATE_ROUTE_SEGMENTS.some((segment) =>
    withoutLocale.startsWith(segment),
  );
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

  // Only redirect to login if the route is private and the user is not logged in
  if (!user && isPrivateRoute(request.nextUrl.pathname)) {
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
