import {
  Body,
  // Column,
  Container,
  Head,
  Hr,
  Html,
  // Img,
  Link,
  // Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { env } from '@/env';
import type { Locale } from '@/stores/global';

interface VerifyEmailTemplateProps {
  verificationUrl: string;
  locale?: Locale;
}

const APP_NAME = env.NEXT_PUBLIC_APP_NAME;
// const SOCIAL_MEDIA_HANDLE = env.NEXT_PUBLIC_SOCIAL_MEDIA_HANDLE;

const translations = {
  id: {
    title: 'Verifikasi Email',
    greeting: 'Assalamualaikum,',
    message_1: `Jazakumullahu khayran katsiran telah bergabung dalam waitlist ${APP_NAME}. Perlu kami sampaikan bahwa aplikasi ini tidak dirancang untuk menggantikan peran guru. Metode talaqqi dan musyafahah bersama guru tetaplah yang utama sebagaimana disunnahkan.`,
    message_2: `Harapan kami, aplikasi ini dapat menjadi pendamping belajar yang memudahkan Antum/Antunna, insyaa Allah. Semoga Allah senantiasa memberkahi waktu dan memudahkan langkah kita dalam mempelajari Al-Qur'an. Aamiin Allahumma Aamiin...`,
    verification: `Silakan klik tombol di bawah ini untuk memverifikasi email.`,
    button: 'Verifikasi Email',
    expiry: 'Link ini akan kadaluarsa dalam 24 jam.',
    ignore: `Jika Antum/Antunna tidak mendaftar di ${APP_NAME}, abaikan email ini.`,
  },
  en: {
    title: 'Verify Your Email',
    greeting: 'Assalamualaykum,',
    message_1: `Jazakumullahu khayran katsiran for joining the ${APP_NAME} waitlist. We would like to emphasize that this application is not designed to replace the role of a teacher. The methods of Talaqqi and Musyafahah with a qualified teacher remain the primary standard, in accordance with the Sunnah.`,
    message_2: `Our hope is that this application serves as a beneficial study companion for you, insyaa Allah. May Allah bless your time and facilitate your journey in learning Quran. Aamiin Allahumma Aamiin...`,
    verification: 'Please click the button below to verify your email.',
    button: 'Verify Email',
    expiry: 'This link will expire in 24 hours.',
    ignore: `If you didn't sign up for ${APP_NAME}, please ignore this email.`,
  },
};

export function VerifyEmailTemplate({ verificationUrl, locale = 'id' }: VerifyEmailTemplateProps) {
  const t = translations[locale];

  return (
    <Html lang={locale}>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 pb-12">
            {/* Header */}
            {/* <Section className="py-10">
              <Row>
                <Column className="w-[80%]">
                  <Text className="font-bold text-2xl">{APP_NAME}</Text>
                </Column>
                <Column align="right">
                  <Row align="right">
                    <Column>
                      <Link href={`https://www.instagram.com/${SOCIAL_MEDIA_HANDLE}`}>
                        <Img
                          src="https://react.email/static/instagram-logo.png"
                          alt="Instagram"
                          height="31"
                          width="31"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={`https://www.facebook.com/${SOCIAL_MEDIA_HANDLE}`}>
                        <Img
                          src="https://react.email/static/facebook-logo.png"
                          alt="Facebook"
                          height="36"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href={`https://x.com/${SOCIAL_MEDIA_HANDLE}`}>
                        <Img
                          src="https://react.email/static/x-logo.png"
                          alt="X"
                          height="29"
                          width="29"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section> */}
            <Text className="text-base leading-7">{t.greeting}</Text>
            <Text className="text-base leading-7">{t.message_1}</Text>
            <Text className="text-base leading-7">{t.message_2}</Text>
            <Text className="font-bold text-base leading-7">{t.verification}</Text>
            <Section className="text-center">
              <Link
                href={verificationUrl}
                className="block bg-violet-700 px-8 py-3 text-center font-semibold text-base text-white"
              >
                {t.button}
              </Link>
            </Section>
            <Hr className="my-5 border-border" />
            <Text className="text-muted-foreground text-xs">{t.expiry}</Text>
            <Text className="text-muted-foreground text-xs">{t.ignore}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
