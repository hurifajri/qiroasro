import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type PrivacyPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'privacy_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath('/privacy', locale as Locale),
      languages: getAlternateLanguages('/privacy'),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'privacy_page' });

  const dataItems = t('sections.data_collected.items').split(',');

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 font-bold text-3xl">{t('title')}</h1>
      <p className="mb-8 text-muted-foreground text-sm">{t('last_updated')}</p>

      <p className="mb-8 text-lg">{t('intro')}</p>

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-xl">
          {t('sections.data_collected.title')}
        </h2>
        <p className="mb-2 text-muted-foreground">
          {t('sections.data_collected.description')}
        </p>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          {dataItems.map((item) => (
            <li key={item}>{item.trim()}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-xl">
          {t('sections.purpose.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('sections.purpose.description')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-xl">
          {t('sections.opt_out.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('sections.opt_out.description')}
        </p>
      </section>

      {/* <section className="mb-8">
        <h2 className="mb-3 font-semibold text-xl">
          {t('sections.contact.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('sections.contact.description')}
        </p>
      </section> */}
    </main>
  );
}
