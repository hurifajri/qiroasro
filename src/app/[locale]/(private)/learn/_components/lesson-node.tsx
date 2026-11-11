'use client';

import { CheckIcon, LockIcon, StarIcon, TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CurriculumLesson } from '../../_lib/curriculum';

interface LessonNodeProps {
  lesson: CurriculumLesson;
  /** Horizontal offset for zigzag pattern (-1, 0, 1) */
  offset?: number;
  onClick?: () => void;
}

/**
 * Circular lesson node component like Duolingo's learning path nodes.
 * Displays different states: locked, available, in-progress, completed.
 * Status defaults to 'available' when not set on the lesson.
 */
export const LessonNode = memo(function LessonNode({
  lesson,
  offset = 0,
  onClick,
}: LessonNodeProps) {
  const t = useTranslations('learn_page');
  const { type, letterSymbol } = lesson;
  const status = lesson.status ?? 'available';
  const isInteractive = status !== 'locked';

  // Determine styles based on status and type
  const getStyles = () => {
    // Base classes for all 3D buttons
    const base =
      'relative flex items-center justify-center rounded-full transition-all duration-150';
    const size = 'size-20 border-0'; // Increased size

    if (status === 'locked') {
      return {
        container: cn(
          base,
          size,
          'bg-muted shadow-[0_6px_0_var(--color-muted-foreground)]',
        ),
        icon: 'text-muted-foreground',
        inner: 'opacity-0',
      };
    }

    // Trophy nodes
    if (type === 'trophy') {
      return {
        container: cn(
          base,
          size,
          'bg-gradient-to-b from-purple-400 to-purple-600 shadow-[0_6px_0_var(--color-accent-violet-dark)]',
          !isInteractive && 'opacity-50 grayscale',
        ),
        icon: 'drop-shadow-md text-white',
        inner: 'bg-white/20',
      };
    }

    // Standard Lesson Nodes
    if (status === 'completed') {
      return {
        container: cn(
          base,
          size,
          'bg-node-articulation shadow-[0_6px_0_var(--color-node-articulation-dark)] active:translate-y-[6px] active:shadow-none',
        ),
        icon: 'text-node-articulation-text',
        inner: 'bg-white/20',
      };
    }

    if (status === 'in-progress' || status === 'available') {
      return {
        container: cn(
          base,
          size,
          'bg-node-letter shadow-[0_6px_0_var(--color-node-letter-dark)] active:translate-y-[6px] active:shadow-none',
        ),
        icon: 'text-white',
        inner: 'bg-white/20',
      };
    }

    return {
      container: cn(
        base,
        size,
        'bg-muted shadow-[0_6px_0_var(--color-muted-foreground)]',
      ),
      icon: 'text-muted-foreground',
      inner: 'opacity-0',
    };
  };

  const styles = getStyles();

  // Determine icon
  const renderIcon = () => {
    const iconClass = cn('size-8', styles.icon);

    if (status === 'locked') return <LockIcon className={iconClass} />;
    if (status === 'completed')
      return <CheckIcon className={cn('size-10 stroke-3', styles.icon)} />;

    switch (type) {
      case 'trophy':
        return <TrophyIcon className={iconClass} />;
      default:
        if (letterSymbol) {
          return (
            <span
              className={cn('pb-1 font-arabic font-bold text-3xl', styles.icon)}
            >
              {letterSymbol}
            </span>
          );
        }
        return <StarIcon className={iconClass} />;
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-1', // Ensure enough height for bounce
        offset === -1 && '-translate-x-16', // Increased offset for larger nodes
        offset === 1 && 'translate-x-16',
      )}
    >
      {/* Floating "Start" label for current lesson */}
      {status === 'in-progress' && (
        <div className="relative mb-2 animate-bounce rounded-xl bg-primary px-3 py-1 font-bold text-primary-foreground text-xs uppercase tracking-wider shadow-sm after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-primary after:content-['']">
          {t('start')}
        </div>
      )}

      {/* Main 3D Node Button */}
      <Button
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        className={cn(
          styles.container,
          isInteractive ? 'cursor-pointer' : 'cursor-not-allowed',
        )}
      >
        {/* Content */}
        <span className="flex items-center justify-center">{renderIcon()}</span>
      </Button>
    </div>
  );
});
