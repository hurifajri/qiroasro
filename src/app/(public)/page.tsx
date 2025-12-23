import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('home_page');

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <h1 className="font-bold text-2xl text-foreground">{t('title')}</h1>
    </div>
  );
}
