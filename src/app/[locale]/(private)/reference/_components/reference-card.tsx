import { LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { ReferenceCategory } from '../_lib/reference';

interface ReferenceCardProps {
  category: ReferenceCategory;
}

export function ReferenceCard({ category }: ReferenceCardProps) {
  const t = useTranslations('reference_page');
  const { titleKey, subtitleKey, iconSymbol, href, available } = category;

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
      <p className="font-bold text-xs">{t(titleKey)}</p>

      {/* Count */}
      <p className="text-muted-foreground text-xs">{t(subtitleKey)}</p>
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
