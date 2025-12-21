import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('global');

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <h1 className="font-bold text-2xl text-foreground">{t('greeting')}</h1>
    </div>
  );
}
