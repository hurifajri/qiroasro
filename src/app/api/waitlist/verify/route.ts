import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get('token');
    if (!token) {
      return redirectWithMessage('error', 'TOKEN_MISSING');
    }

    const supabase = getSupabaseClient();

    // Find the waitlist entry by token
    const { data: entry, error: findError } = await supabase
      .from('waitlist')
      .select('id, email, status, locale')
      .eq('verification_token', token)
      .single();

    if (findError || !entry) {
      return redirectWithMessage('error', 'TOKEN_INVALID_OR_EXPIRED');
    }

    if (entry.status === 'verified') {
      return redirectWithMessage('already_verified', 'EMAIL_ALREADY_VERIFIED', entry.locale);
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
      return redirectWithMessage('error', 'UPDATE_FAILED');
    }

    return redirectWithMessage('success', 'EMAIL_VERIFIED_SUCCESSFULLY', entry.locale);
  } catch {
    return redirectWithMessage('error', 'INTERNAL_SERVER_ERROR');
  }
}

function redirectWithMessage(status: string, messageCode: string, locale?: string) {
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  const url = new URL('/', appUrl);

  url.searchParams.set('waitlist_status', status);
  url.searchParams.set('waitlist_message_code', messageCode);

  if (locale) url.searchParams.set('locale', locale);

  return NextResponse.redirect(url, { status: 302 });
}
