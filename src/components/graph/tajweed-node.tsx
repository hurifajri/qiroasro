import type { ReactNode } from 'react';

import { BaseNode, BaseNodeContent } from '@/components/graph/base-node';
import { cn } from '@/lib/utils';

export const LETTER_TAFKHIM_TYPES = [
  'always_tafkhim',
  'conditional',
  'always_tarqiq',
] as const;

export type LetterTafkhimType = (typeof LETTER_TAFKHIM_TYPES)[number];

/**
 * Gradient colors per letter tafkhim group, used with `bg-linear-to-br`.
 * - always_tafkhim: 7 isti'la letters (always thick)
 * - conditional: alif, lam, ra (thick or thin depending on context)
 * - always_tarqiq: remaining letters (always thin)
 */
export const LETTER_TAFKHIM_GRADIENT: Record<LetterTafkhimType, string> = {
  always_tafkhim: 'from-node-letter-tafkhim to-node-letter-tafkhim-dark',
  conditional: 'from-node-letter-conditional to-node-letter-conditional-dark',
  always_tarqiq: 'from-node-letter to-node-letter-dark',
};

const LETTER_NODE_SIZES = {
  default: 'size-24',
  sm: 'size-16',
} as const;

type LetterNodeShellProps = Readonly<{
  symbol: string;
  label?: string;
  tafkhimType: LetterTafkhimType;
  size?: keyof typeof LETTER_NODE_SIZES;
  className?: string;
  children?: ReactNode;
}>;

/**
 * Reusable Hijaiyyah letter graph node shell shared by Playground and showcases.
 */
export function LetterNodeShell({
  symbol,
  label,
  tafkhimType,
  size = 'default',
  className,
  children,
}: LetterNodeShellProps) {
  return (
    <BaseNode
      className={cn(
        'flex items-center justify-center rounded-full border-0 bg-linear-to-br hover:ring-0',
        LETTER_NODE_SIZES[size],
        LETTER_TAFKHIM_GRADIENT[tafkhimType],
        className,
      )}
    >
      <BaseNodeContent className="flex flex-col items-center justify-center gap-0 p-0 text-node-letter-text select-none">
        <span className="font-arabic text-4xl font-bold">{symbol}</span>
        {label && (
          <span className="px-1 text-center text-xs leading-tight">
            {label}
          </span>
        )}
      </BaseNodeContent>
      {children}
    </BaseNode>
  );
}

type GroupNodeShellProps = Readonly<{
  label: string;
  className?: string;
  children?: ReactNode;
}>;

/**
 * Reusable Makhraj 'Am (Articulation Area) graph node shell.
 */
export function ArticulationAreaNodeShell({
  label,
  className,
  children,
}: GroupNodeShellProps) {
  return (
    <BaseNode
      className={cn(
        'rounded-xl border-0 bg-linear-to-br from-node-articulation to-node-articulation-dark px-6 py-4 hover:ring-0',
        className,
      )}
    >
      <BaseNodeContent className="p-0 text-sm font-semibold text-node-letter-text capitalize select-none">
        {label}
      </BaseNodeContent>
      {children}
    </BaseNode>
  );
}

type LeafNodeShellProps = Readonly<{
  label: string;
  isDashed?: boolean;
  className?: string;
  children?: ReactNode;
}>;

/**
 * Reusable Makhraj Khas (Articulation Point) graph node shell.
 */
export function ArticulationPointNodeShell({
  label,
  isDashed = false,
  className,
  children,
}: LeafNodeShellProps) {
  return (
    <BaseNode
      className={cn(
        'rounded-lg border-2 border-node-articulation/50 bg-node-articulation-secondary px-4 py-2 text-node-articulation-text hover:ring-0',
        isDashed && 'border-dashed',
        className,
      )}
    >
      <BaseNodeContent className="p-0 text-xs font-medium capitalize select-none">
        {label}
      </BaseNodeContent>
      {children}
    </BaseNode>
  );
}

/**
 * Reusable Sifat Group graph node shell.
 */
export function TraitGroupNodeShell({
  label,
  className,
  children,
}: GroupNodeShellProps) {
  return (
    <BaseNode
      className={cn(
        'rounded-xl border-0 bg-linear-to-br from-node-trait to-node-trait-dark px-6 py-4 hover:ring-0',
        className,
      )}
    >
      <BaseNodeContent className="flex flex-col items-center p-0 text-sm font-semibold text-node-letter-text capitalize select-none">
        {label}
      </BaseNodeContent>
      {children}
    </BaseNode>
  );
}

/**
 * Reusable Sifat (Letter Characteristic) graph node shell.
 */
export function TraitNodeShell({
  label,
  isDashed = false,
  className,
  children,
}: LeafNodeShellProps) {
  return (
    <BaseNode
      className={cn(
        'rounded-lg border-2 border-node-trait/50 bg-node-trait-secondary px-4 py-2 text-node-trait-text hover:ring-0',
        isDashed && 'border-dashed',
        className,
      )}
    >
      <BaseNodeContent className="flex flex-col items-center p-0 text-xs font-medium capitalize select-none">
        {label}
      </BaseNodeContent>
      {children}
    </BaseNode>
  );
}
