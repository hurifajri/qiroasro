import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get('token');
    if (!token) {
      return redirectWithMessage('error', 'Missing verification token');
    }

    const supabase = getSupabaseClient();

    // Find the waitlist entry by token
    const { data: entry, error: findError } = await supabase
      .from('waitlist')
      .select('id, email, status, locale')
      .eq('verification_token', token)
      .single();

    if (findError || !entry) {
      return redirectWithMessage('error', 'Invalid or expired verification token');
    }

    if (entry.status === 'verified') {
      return redirectWithMessage('already_verified', 'Email already verified', entry.locale);
    }

    // Update status to verified
    const { error: updateError } = await supabase
      .from('waitlist')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        verification_token: null, // Clear token after use
      })
      .eq('id', entry.id);

    if (updateError) {
      console.error('Error verifying email:', updateError);
      return redirectWithMessage('error', 'Failed to verify email');
    }

    return redirectWithMessage('success', 'Email verified successfully', entry.locale);
  } catch (error) {
    console.error('Verification error:', error);
    return redirectWithMessage('error', 'Internal server error');
  }
}

function redirectWithMessage(status: string, message: string, locale?: string) {
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  const url = new URL('/', appUrl);

  url.searchParams.set('waitlist_status', status);
  url.searchParams.set('waitlist_message', message);

  if (locale) url.searchParams.set('locale', locale);

  return NextResponse.redirect(url, { status: 302 });
}
