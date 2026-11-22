import { CheckIcon, LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { Letter } from '../_lib/mock-data';

interface LetterCardProps {
  letter: Letter;
}

export function LetterCard({ letter }: Readonly<LetterCardProps>) {
  const t = useTranslations('reference_letters_page');
  const { symbol, nameKey, status } = letter;
  const isLearned = status === 'learned';
  const isAvailable = status === 'available';
  const isLocked = status === 'locked';

  function handleClick() {
    console.log('Letter clicked:', letter);
  }

  return (
    <Button
      onClick={!isLocked ? handleClick : undefined}
      disabled={isLocked}
      className={cn(
        'group relative flex h-full w-full flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all',
        isLearned &&
          'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20',
        isAvailable && 'border-primary/50 bg-primary/10 hover:bg-primary/20',
        isLocked && 'cursor-not-allowed border-muted bg-muted/30 opacity-50',
      )}
    >
      {/* Status indicator */}
      {isLearned && (
        <div className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500">
          <CheckIcon className="size-3 text-white" />
        </div>
      )}
      {isLocked && (
        <LockIcon className="absolute top-1 right-1 size-4 text-muted-foreground" />
      )}

      {/* Letter symbol */}
      <span
        className={cn(
          'font-arabic text-3xl font-bold',
          isLearned && 'text-emerald-600 dark:text-emerald-400',
          isAvailable && 'text-primary',
          isLocked && 'text-muted-foreground',
        )}
      >
        {symbol}
      </span>

      {/* Letter name */}
      <p className="text-xs font-bold">{t(nameKey)}</p>
    </Button>
  );
}
