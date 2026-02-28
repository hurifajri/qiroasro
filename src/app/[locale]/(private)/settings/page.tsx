import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Settings } from './_components/settings';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('settings_page.metadata');

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default function SettingsPage() {
  return <Settings />;
}
