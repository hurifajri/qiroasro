import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { VerifyEmailTemplate } from '@/components/email-templates/verify-email';
import { waitlist } from '@/db/common-schema';
import { env } from '@/env';
import type { Locale } from '@/i18n/routing';
import { db } from '@/lib/db';
import { getResendClient } from '@/lib/resend';
import { emailRegex } from '@/lib/utils';

// export const runtime = 'edge';

const FROM_EMAIL = `${env.NEXT_PUBLIC_APP_NAME} <${env.NEXT_PUBLIC_NOREPLY_EMAIL}>`;

const translations = {
  id: { subject: `Verifikasi Email - ${env.NEXT_PUBLIC_APP_NAME}` },
  en: { subject: `Verify Your Email - ${env.NEXT_PUBLIC_APP_NAME}` },
  tr: { subject: `E-posta Doğrulama - ${env.NEXT_PUBLIC_APP_NAME}` },
  ms: { subject: `Pengesahan E-mel - ${env.NEXT_PUBLIC_APP_NAME}` },
  ar: { subject: `التحقق من البريد الإلكتروني - ${env.NEXT_PUBLIC_APP_NAME}` },
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
    const {
      email,
      locale = 'id',
      source = 'homepage',
      utmSource,
      utmMedium,
      utmCampaign,
    } = body;

    // Validate email
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message_code: 'invalid_email' },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existing = await db.query.waitlist.findFirst({
      where: (table, { eq }) => eq(table.email, email.toLowerCase().trim()),
      columns: {
        id: true,
        status: true,
        verificationToken: true,
      },
    });

    let verificationToken: string | null = null;

    if (existing) {
      if (existing.status === 'verified') {
        return NextResponse.json(
          { success: false, message_code: 'already_verified' },
          { status: 409 },
        );
      }

      // Resend verification email for pending status
      verificationToken = existing.verificationToken;

      const newVerificationToken = crypto.randomUUID();

      // Update verification token to a new one
      const updated = await db
        .update(waitlist)
        .set({
          verificationToken: newVerificationToken,
          updatedAt: new Date(),
        })
        .where(eq(waitlist.id, existing.id))
        .returning({ verificationToken: waitlist.verificationToken });

      if (!updated.length) {
        return NextResponse.json(
          { success: false, message_code: 'update_error' },
          { status: 500 },
        );
      }

      verificationToken = updated[0].verificationToken;
    } else {
      // Insert new entry
      try {
        const newEntry = await db
          .insert(waitlist)
          .values({
            email: email.toLowerCase().trim(),
            locale,
            source,
            utmSource,
            utmMedium,
            utmCampaign,
          })
          .returning({ verificationToken: waitlist.verificationToken });

        verificationToken = newEntry[0].verificationToken;
      } catch (err) {
        const insertError = err as { code?: string };
        // Handle unique constraint violation
        if (insertError.code === '23505') {
          return NextResponse.json(
            { success: false, message_code: 'email_exists' },
            { status: 409 },
          );
        }

        return NextResponse.json(
          { success: false, message_code: 'insert_error' },
          { status: 500 },
        );
      }
    }

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message_code: 'insert_error' },
        { status: 500 },
      );
    }

    // Build verification URL
    const appUrl = env.NEXT_PUBLIC_APP_URL;
    const verificationUrl = `${appUrl}/api/waitlist/verify?token=${verificationToken}`;

    // Send verification email
    const resend = getResendClient();

    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: translations[locale].subject,
      react: VerifyEmailTemplate({ verificationUrl, locale }),
    });

    if (emailError) {
      return NextResponse.json(
        { success: false, message_code: 'email_error' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message_code: 'internal_error' },
      { status: 500 },
    );
  }
}
