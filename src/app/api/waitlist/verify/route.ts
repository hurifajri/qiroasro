import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { waitlist } from '@/db/schema';
import { env } from '@/env';
import { db } from '@/lib/db';

// export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get('token');
    if (!token) {
      return redirectWithMessage('error');
    }

    // Find the waitlist entry by token
    const entry = await db.query.waitlist.findFirst({
      where: (table, { eq }) => eq(table.verificationToken, token),
      columns: {
        id: true,
        email: true,
        status: true,
        locale: true,
      },
    });

    if (!entry) {
      return redirectWithMessage('error');
    }

    if (entry.status === 'verified') {
      return redirectWithMessage('already_verified', entry.locale || 'id');
    }

    // Update status to verified
    await db
      .update(waitlist)
      .set({
        status: 'verified',
        verifiedAt: new Date(),
      })
      .where(eq(waitlist.id, entry.id));

    return redirectWithMessage('success', entry.locale || 'id');
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
