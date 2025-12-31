import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get('token');
    if (!token) {
      return redirectWithMessage('error');
    }

    const supabase = getSupabaseClient();

    // Find the waitlist entry by token
    const { data: entry, error: findError } = await supabase
      .from('waitlist')
      .select('id, email, status, locale')
      .eq('verification_token', token)
      .single();

    if (findError || !entry) {
      return redirectWithMessage('error');
    }

    if (entry.status === 'verified') {
      return redirectWithMessage('already_verified', entry.locale);
    }

    // Update status to verified
    const { error: updateError } = await supabase
      .from('waitlist')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        // Keep verification_token so we can show 'already_verified' if user clicks again
      })
      .eq('id', entry.id);

    if (updateError) {
      return redirectWithMessage('error');
    }

    return redirectWithMessage('success', entry.locale);
  } catch {
    return redirectWithMessage('error');
  }
}

function redirectWithMessage(status: string, locale?: string) {
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  const url = new URL('/', appUrl);

  url.searchParams.set('waitlist_status', status);

  if (locale) url.searchParams.set('locale', locale);

  return NextResponse.redirect(url, { status: 302 });
}
