import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CURRICULUM_TOPICS } from '../../_lib/curriculum';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return CURRICULUM_TOPICS.filter((topic) => topic.available).map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = CURRICULUM_TOPICS.find((t) => t.slug === slug);
  if (!topic) return {};

  const t = await getTranslations({ locale });

  return {
    title: t(topic.titleKey),
    description: t(topic.subtitleKey),
    robots: { index: false, follow: false },
  };
}

export default async function ReferenceSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const topic = CURRICULUM_TOPICS.find((t) => t.slug === slug);
  if (!topic || !topic.available) notFound();

  try {
    const { default: Content } = await import(
      `../_contents/${slug}/${locale}.mdx`
    );
    return <Content />;
  } catch {
    notFound();
  }
}
