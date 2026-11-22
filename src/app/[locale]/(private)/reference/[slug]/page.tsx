import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { CURRICULUM_TOPICS } from '../../_lib/curriculum';
import { getTopicReferenceDetails } from '../../_services/reference';
import { TopicReferenceSupplement } from '../_components/topic-reference-supplement';

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

export default async function ReferenceSlugPage({
  params,
}: Readonly<PageProps>) {
  const { locale, slug } = await params;

  const topic = CURRICULUM_TOPICS.find((t) => t.slug === slug);
  if (!topic?.available) notFound();

  const sections = await getTopicReferenceDetails(slug);

  let Content: React.ComponentType | null = null;
  try {
    const mod = (await import(`../_contents/${slug}/${locale}.mdx`)) as {
      default: React.ComponentType;
    };
    Content = mod.default;
  } catch {
    Content = null;
  }

  if (!Content && sections.length === 0) {
    notFound();
  }

  return (
    <div className="w-full min-w-0">
      {Content && <Content />}
      {sections.length > 0 && <TopicReferenceSupplement sections={sections} />}
    </div>
  );
}
