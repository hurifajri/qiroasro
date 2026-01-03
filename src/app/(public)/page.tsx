import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Home } from './components/home';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home_page.metadata');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/',
      languages: { id: '/', en: '/' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations('home_page');

  return (
    <>
      <h1 className="sr-only">{t('title')}</h1>
      <Home />
    </>
  );
}
