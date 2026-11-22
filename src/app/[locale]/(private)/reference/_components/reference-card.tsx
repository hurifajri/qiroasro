import { LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import type { CurriculumTopic } from '../../_lib/curriculum';

interface ReferenceCardProps {
  topic: CurriculumTopic;
}

export function ReferenceCard({ topic }: Readonly<ReferenceCardProps>) {
  const t = useTranslations();
  const { titleKey, subtitleKey, iconSymbol, href, available } = topic;

  const content = (
    <div
      className={cn(
        'relative flex h-full flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-center transition-all',
        available
          ? 'border-border bg-card hover:border-primary hover:bg-primary/5'
          : 'cursor-not-allowed border-muted bg-muted/30 opacity-60',
      )}
    >
      {!available && (
        <LockIcon className="absolute top-2 right-2 size-5 text-muted-foreground" />
      )}

      {/* Icon/Symbol */}
      <span className="font-arabic text-4xl">{iconSymbol}</span>

      {/* Title */}
      <p className="text-xs font-bold">{t(titleKey)}</p>

      {/* Count */}
      <p className="text-xs text-muted-foreground">{t(subtitleKey)}</p>
    </div>
  );

  if (!available) {
    return content;
  }

  return (
    <Link href={href} className="h-full">
      {content}
    </Link>
  );
}
