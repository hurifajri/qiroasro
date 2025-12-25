import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { VerifyEmailTemplate } from '@/lib/email-templates/verify-email';
import { getResendClient } from '@/lib/resend';
import { getSupabaseClient } from '@/lib/supabase';
import type { Locale } from '@/stores/global';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const translations = {
  id: {
    subject: 'Verifikasi Email - QiroAsro',
    message: 'Email verifikasi telah dikirim. Silakan cek inbox Anda.',
  },
  en: {
    subject: 'Verify Your Email - QiroAsro',
    message: 'Verification email sent. Please check your inbox.',
  },
};

interface WaitlistRequest {
  email: string;
  locale?: Locale;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WaitlistRequest;
    const { email, locale = 'id', source = 'homepage', utmSource, utmMedium, utmCampaign } = body;

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id, status, verification_token')
      .eq('email', email.toLowerCase().trim())
      .single();

    let verificationToken: string;

    if (existing) {
      if (existing.status === 'verified') {
        return NextResponse.json(
          { success: false, error: 'Email already verified', code: 'ALREADY_VERIFIED' },
          { status: 409 },
        );
      }

      // Resend verification email for pending status
      verificationToken = existing.verification_token;

      // Update verification token to a new one
      const { data: updated, error: updateError } = await supabase
        .from('waitlist')
        .update({
          verification_token: crypto.randomUUID(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('verification_token')
        .single();

      if (updateError) {
        console.error('Error updating waitlist:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update subscription' },
          { status: 500 },
        );
      }

      verificationToken = updated.verification_token;
    } else {
      // Insert new entry
      const { data: newEntry, error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email: email.toLowerCase().trim(),
          locale,
          source,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        })
        .select('verification_token')
        .single();

      if (insertError) {
        console.error('Error inserting to waitlist:', insertError);

        // Handle unique constraint violation
        if (insertError.code === '23505') {
          return NextResponse.json(
            { success: false, error: 'Email already exists', code: 'EMAIL_EXISTS' },
            { status: 409 },
          );
        }

        return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
      }

      verificationToken = newEntry.verification_token;
    }

    // Build verification URL
    const appUrl = env.NEXT_PUBLIC_APP_URL;
    const verificationUrl = `${appUrl}/api/waitlist/verify?token=${verificationToken}`;

    // Send verification email
    const resend = getResendClient();

    const { error: emailError } = await resend.emails.send({
      from: 'QiroAsro <onboarding@resend.dev>', // Change to your domain after verification
      to: [email],
      subject: translations[locale].subject,
      react: VerifyEmailTemplate({ verificationUrl, locale }),
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: translations[locale].message,
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
