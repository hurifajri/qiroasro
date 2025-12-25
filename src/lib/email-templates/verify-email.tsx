import type { Locale } from '@/stores/global';

interface VerifyEmailTemplateProps {
  verificationUrl: string;
  locale?: Locale;
}

const translations = {
  id: {
    title: 'Verifikasi Email Anda',
    greeting: 'Assalamualaikum,',
    message:
      'Terima kasih telah bergabung dengan waitlist Qiro Asro! Silakan klik tombol di bawah untuk memverifikasi email Anda.',
    button: 'Verifikasi Email',
    expiry: 'Link ini akan kadaluarsa dalam 24 jam.',
    ignore: 'Jika Anda tidak mendaftar di Qiro Asro, abaikan email ini.',
    footer: 'Tim Qiro Asro',
  },
  en: {
    title: 'Verify Your Email',
    greeting: 'Assalamualaikum,',
    message:
      'Thank you for joining the Qiro Asro waitlist! Please click the button below to verify your email address.',
    button: 'Verify Email',
    expiry: 'This link will expire in 24 hours.',
    ignore: "If you didn't sign up for Qiro Asro, please ignore this email.",
    footer: 'The Qiro Asro Team',
  },
};

export function VerifyEmailTemplate({ verificationUrl, locale = 'id' }: VerifyEmailTemplateProps) {
  const t = translations[locale];

  return (
    <html lang={locale}>
      <body
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: '#f8fafc',
          margin: 0,
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              Qiro Asro
            </h1>
          </div>

          {/* Content */}
          <div style={{ padding: '32px' }}>
            <h2
              style={{
                color: '#1e293b',
                fontSize: '20px',
                fontWeight: '600',
                marginTop: 0,
                marginBottom: '16px',
              }}
            >
              {t.title}
            </h2>

            <p
              style={{
                color: '#475569',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '8px',
              }}
            >
              {t.greeting}
            </p>

            <p
              style={{
                color: '#475569',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              {t.message}
            </p>

            {/* CTA Button */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <a
                href={verificationUrl}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
                }}
              >
                {t.button}
              </a>
            </div>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '8px',
              }}
            >
              {t.expiry}
            </p>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: '0',
              }}
            >
              {t.ignore}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: '24px 32px',
              textAlign: 'center',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <p
              style={{
                color: '#64748b',
                fontSize: '14px',
                margin: 0,
              }}
            >
              {t.footer}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
