import { Resend } from 'resend';
import { env } from '@/env';

export function getResendClient() {
  return new Resend(env.RESEND_API_KEY);
}
