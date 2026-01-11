import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Home } from './components/home';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home_page.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'id' ? '/' : '/en/',
      languages: { id: '/', en: '/en/' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home_page');

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Home />
    </>
  );
}
