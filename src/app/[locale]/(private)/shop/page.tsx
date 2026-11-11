import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Shop } from './_components/shop';
import { MOCK_HEARTS_ITEMS, MOCK_POWERUP_ITEMS } from './_lib/mock-data';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'shop_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function ShopPage({ params }: PageProps) {
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
