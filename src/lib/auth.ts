import { AuthProvider } from '@/services/auth-provider';

/**
 * Provider-agnostic authentication wrapper.
 * This file acts as the public API for authentication throughout the application.
 * Changing the underlying provider (e.g. from Supabase to Better Auth) only requires
 * changing the implementation in `services/auth-provider.ts`.
 */

export type AuthProviderType = 'google' | 'apple'; // Add other providers here if needed

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

export interface Session {
  user: User;
  accessToken: string;
}

/**
 * Initiate an OAuth sign-in flow.
 * @param provider The OAuth provider to use (e.g., 'google')
 * @param redirectTo Optional URL to redirect to after successful login
 */
export async function signIn(provider: AuthProviderType, redirectTo?: string) {
  return AuthProvider.signIn(provider, redirectTo);
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  return AuthProvider.signOut();
}

/**
 * Obtain the currently authenticated user (server-side context).
 * Use this in Server Components, API Routes, and Server Actions.
 */
export async function getUser(): Promise<User | null> {
  return AuthProvider.getUser();
}

/**
 * Obtain the current authentication session.
 */
export async function getSession(): Promise<Session | null> {
  return AuthProvider.getSession();
}
