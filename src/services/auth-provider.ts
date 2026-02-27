import type { AuthProviderType, Session, User } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Supabase implementation for the Auth Provider.
 * This class abstracts away Supabase-specific logic from the rest of the app.
 */
export const AuthProvider = {
  /**
   * SignIn method implemented for the client-side.
   */
  async signIn(provider: AuthProviderType, redirectTo?: string) {
    const supabase = createClient();

    // Default redirect to home page if not provided
    const redirectUrl = redirectTo
      ? `${window.location.origin}${redirectTo}`
      : `${window.location.origin}/api/auth/callback?next=/`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * SignOut method implemented for the client-side.
   */
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get user method implemented for the server-side.
   * Can be used in React Server Components or Server Actions.
   */
  async getUser(): Promise<User | null> {
    try {
      const supabase = await createServerClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return null;

      // Transform Supabase user to our generic User type
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url,
      };
    } catch {
      return null;
    }
  },

  /**
   * Get session method implemented for the server-side.
   * IMPORTANT: Always call getUser() first on the server to validate the JWT
   * with Supabase servers. getSession() alone only reads the cookie without
   * verification and is NOT safe on the server.
   * See: https://supabase.com/docs/reference/javascript/auth-getsession
   */
  async getSession(): Promise<Session | null> {
    try {
      const supabase = await createServerClient();

      // Verify the user JWT with Supabase servers first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return null;

      // Now safely retrieve the validated session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return null;

      return {
        accessToken: session.access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatarUrl: user.user_metadata?.avatar_url,
        },
      };
    } catch {
      return null;
    }
  },
};
