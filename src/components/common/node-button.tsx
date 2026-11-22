'use client';

import { CheckIcon, LockIcon, StarIcon, TrophyIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type NodeButtonType = 'quiz' | 'trophy';
export type NodeButtonStatus =
  'locked' | 'available' | 'in-progress' | 'completed';

export type NodeButtonProps = Readonly<{
  type?: NodeButtonType;
  status?: NodeButtonStatus;
  letterSymbol?: string;
  offset?: -1 | 0 | 1;
  startLabel?: string;
  size?: 'default' | 'sm';
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}>;

const SIZE_CLASSES: Record<'default' | 'sm', string> = {
  default: 'size-20',
  sm: 'size-16',
};

const OFFSET_CLASSES: Record<-1 | 0 | 1, string> = {
  [-1]: '-translate-x-16',
  0: '',
  1: 'translate-x-16',
};

function getNodeVisuals(status: NodeButtonStatus, type: NodeButtonType) {
  if (status === 'locked') {
    return {
      container: 'bg-muted shadow-[0_6px_0_var(--color-muted-foreground)]',
      icon: 'text-muted-foreground',
    };
  }

  if (type === 'trophy') {
    return {
      container:
        'bg-linear-to-b from-node-trait to-node-trait-dark shadow-[0_6px_0_var(--color-accent-violet-dark)] active:translate-y-[6px] active:shadow-none',
      icon: 'text-node-letter-text drop-shadow-md',
    };
  }

  if (status === 'completed') {
    return {
      container:
        'bg-node-articulation shadow-[0_6px_0_var(--color-node-articulation-dark)] active:translate-y-[6px] active:shadow-none',
      icon: 'text-node-letter-text',
    };
  }

  return {
    container:
      'bg-node-letter shadow-[0_6px_0_var(--color-node-letter-dark)] active:translate-y-[6px] active:shadow-none',
    icon: 'text-node-letter-text',
  };
}

function renderNodeIcon(
  status: NodeButtonStatus,
  type: NodeButtonType,
  iconClass: string,
  letterSymbol?: string,
): ReactNode {
  if (status === 'locked') {
    return <LockIcon className={cn('size-8', iconClass)} />;
  }

  if (status === 'completed') {
    return <CheckIcon className={cn('size-10 stroke-3', iconClass)} />;
  }

  if (type === 'trophy') {
    return <TrophyIcon className={cn('size-8', iconClass)} />;
  }

  if (letterSymbol) {
    return (
      <span className={cn('pb-1 font-arabic text-3xl font-bold', iconClass)}>
        {letterSymbol}
      </span>
    );
  }

  return <StarIcon className={cn('size-8', iconClass)} />;
}

/**
 * Tactile 3D circular node button reused across the learning path and previews.
 */
export function NodeButton({
  type = 'quiz',
  status = 'available',
  letterSymbol,
  offset = 0,
  startLabel,
  size = 'default',
  onClick,
  className,
  ariaLabel,
}: NodeButtonProps) {
  const isInteractive = status !== 'locked';
  const visuals = getNodeVisuals(status, type);

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-1',
        OFFSET_CLASSES[offset],
      )}
    >
      {status === 'in-progress' && startLabel && (
        <div className="relative mb-2 animate-bounce rounded-xl bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground uppercase shadow-sm after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-primary after:content-['']">
          {startLabel}
        </div>
      )}

      <Button
        type="button"
        aria-label={ariaLabel}
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        className={cn(
          'relative flex items-center justify-center rounded-full border-0 transition-all duration-150',
          SIZE_CLASSES[size],
          visuals.container,
          isInteractive ? 'cursor-pointer' : 'cursor-not-allowed',
          className,
        )}
      >
        <span className="flex items-center justify-center">
          {renderNodeIcon(status, type, visuals.icon, letterSymbol)}
        </span>
      </Button>
    </div>
  );
}
