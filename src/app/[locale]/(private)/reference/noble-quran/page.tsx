import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'reference_noble_quran_page.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default async function NobleQuranPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { default: Content } = await import(`./_contents/${locale}.mdx`);

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Content />
    </article>
  );
}
