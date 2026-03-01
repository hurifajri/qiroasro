/**
 * Application routes configuration
 *
 * Defines all public and private routes for reuse across the application (e.g., middleware, sitemap, robots.txt)
 */

export const PUBLIC_ROUTES = ['/', '/playground'] as const;

export const PRIVATE_ROUTES = [
  '/leaderboard',
  '/learn',
  '/practice',
  '/profile',
  '/quests',
  '/reference',
  '/settings',
  '/shop',
] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type PrivateRoute = (typeof PRIVATE_ROUTES)[number];
export type AppRoute = PublicRoute | PrivateRoute;
