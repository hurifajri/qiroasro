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
import type { Locale } from '@/i18n/routing';

interface VerifyEmailTemplateProps {
  verificationUrl: string;
  locale?: Locale;
}

const APP_NAME = env.NEXT_PUBLIC_APP_NAME;

const translations = {
  id: {
    title: 'Verifikasi Email',
    greeting: 'Assalamualaikum,',
    message_1: `Jazakumullahu khairan katsiran telah mendaftar dalam waitlist ${APP_NAME}. Insya Allah, kami akan segera mengabari begitu aplikasi ini resmi diluncurkan dan siap digunakan.`,
    message_2: `Perlu kami sampaikan bahwa aplikasi ini tidak dibuat untuk menggantikan peran dari seorang guru. Metode talaqqi dan musyafahah bersama guru tetaplah yang utama sebagaimana disunnahkan. Harapan kami, aplikasi ini dapat menjadi wasilah yang memudahkan kita semua dalam mempelajari ilmu tajwid. Semoga Allah memberkahi dan memudahkan proses pengembangannya.`,
    verification: `Silakan klik tombol di bawah untuk memverifikasi email agar kami dapat menghubungi saat rilis nanti.`,
    button: 'Verifikasi Email',
    expiry: 'Tautan ini akan kadaluarsa dalam 24 jam.',
    ignore: `Abaikan email ini jika tidak merasa mendaftar.`,
  },
  en: {
    title: 'Verify Your Email',
    greeting: 'Assalamualaikum,',
    message_1: `Jazakumullahu khairan katsiran for joining the ${APP_NAME} waitlist. Insha Allah, we will notify you as soon as the app is officially released and ready for use.`,
    message_2: `We would like to emphasize that this app is not created to replace the role of a teacher. The methods of Talaqqi and Musyafahah with a teacher remain the primary way, as is the Sunnah. Our hope is that this app serves as a wasilah (means) to facilitate us all in learning Tajweed. May Allah bless and ease the development process.`,
    verification: `Please click the button below to verify your email so we can reach you upon launch.`,
    button: 'Verify Email',
    expiry: 'This link will expire in 24 hours.',
    ignore: `Please ignore this email if you did not sign up.`,
  },
  tr: {
    title: 'E-posta Doğrulama',
    greeting: 'Selamün Aleyküm,',
    message_1: `${APP_NAME} bekleme listesine katıldığınız için Cezakümullahu hayran kesiran. İnşallah, uygulama resmi olarak yayınlandığında ve kullanıma hazır olduğunda sizi bilgilendireceğiz.`,
    message_2: `Bu uygulamanın bir hocanın yerini almak için oluşturulmadığını önemle belirtmek isteriz. Talakki ve Müşafehe usulüyle bir hocadan öğrenmek, Sünnete uygun olan asıl yöntemdir. Umudumuz, bu uygulamanın Tecvid öğrenmemizi kolaylaştıracak bir vesile olmasıdır. Allah geliştirme sürecini bereketli ve kolay kılsın.`,
    verification: `Uygulama yayınlandığında sizinle iletişime geçebilmemiz için lütfen aşağıdaki düğmeye tıklayarak e-postanızı doğrulayın.`,
    button: 'E-postayı Doğrula',
    expiry: 'Bu bağlantı 24 saat içinde geçerliliğini yitirecektir.',
    ignore: `Kayıt olmadıysanız lütfen bu e-postayı dikkate almayın.`,
  },
};

export function VerifyEmailTemplate({
  verificationUrl,
  locale = 'id',
}: VerifyEmailTemplateProps) {
  const t = translations[locale];

  return (
    <Html lang={locale}>
      <Head />
      <Tailwind>
        <Body className="font-sans">
          <Container>
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
            <Text className="font-bold text-base leading-7">
              {t.verification}
            </Text>
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
