import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  getAlternateLanguages,
  getLocalePath,
  getOgLocale,
} from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { Shop } from './_components/shop';
import { MOCK_HEARTS_ITEMS, MOCK_POWERUP_ITEMS } from './_lib/mock-data';

type GenerateMetadataProps = {
  params: Promise<{ locale: string }>;
};

type ShopPageProps = GenerateMetadataProps;

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'shop_page.metadata',
  });

  const path = '/shop';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getLocalePath(path, locale as Locale),
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: getOgLocale(locale as Locale),
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'shop_page' });

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Shop heartsItems={MOCK_HEARTS_ITEMS} powerupItems={MOCK_POWERUP_ITEMS} />
    </>
  );
}
