import { BookOpenIcon, QuoteIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { TopicReferenceSection } from '../../_schemas/reference';

interface TopicReferenceSupplementProps {
  sections: readonly TopicReferenceSection[];
}

function formatSlugLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function TopicReferenceSupplement({
  sections,
}: Readonly<TopicReferenceSupplementProps>) {
  if (sections.length === 0) return null;

  return (
    <section className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 px-6 pb-8">
      {sections.map((section) => (
        <Card key={section.slug}>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <BookOpenIcon className="size-4 text-primary" />
              {formatSlugLabel(section.slug)}
            </CardTitle>
            {section.definitionsCount > 0 && (
              <Badge variant="secondary">
                {section.definitionsCount} rules
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {section.examples.length > 0 && (
              <div className="flex flex-col gap-2">
                {section.examples.map((example) => (
                  <div
                    key={example.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/30 px-4 py-2.5"
                  >
                    <Badge variant="outline" className="font-mono text-xs">
                      {example.surahNumber}:{example.ayahNumber}
                    </Badge>
                    <p
                      lang="ar"
                      dir="rtl"
                      className="text-end font-arabic text-xl leading-loose"
                    >
                      {example.arabicText}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.citations.length > 0 && (
              <div className="flex flex-col gap-2">
                {section.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="flex flex-col gap-1.5 rounded-xl border bg-card p-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <QuoteIcon className="size-3.5" />
                        {formatSlugLabel(citation.sourceSlug)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {citation.verseEnd
                          ? `${citation.verseStart}-${citation.verseEnd}`
                          : citation.verseStart}
                      </Badge>
                    </div>
                    {citation.verses.map((verse) => (
                      <p
                        key={verse.verseNumber}
                        lang="ar"
                        dir="rtl"
                        className="text-end font-arabic text-lg leading-loose"
                      >
                        {verse.arabicText}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
