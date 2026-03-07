'use client';

import { useTranslations } from 'next-intl';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProfileFieldRowProps {
  id: string;
  labelKey: string;
  value: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email';
  placeholder?: string;
  disabled?: boolean;
  /** Helper text shown below the input */
  hint?: string;
  /** Controls hint text color */
  hintVariant?: 'default' | 'success' | 'error';
}

export function ProfileFieldRow({
  id,
  labelKey,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  hint,
  hintVariant = 'default',
}: ProfileFieldRowProps) {
  const t = useTranslations('settings_page.profile.personal_info');

  return (
    <Field>
      <FieldContent>
        <FieldLabel htmlFor={id}>{t(labelKey)}</FieldLabel>
      </FieldContent>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {hint && hintVariant === 'error' && <FieldError>{hint}</FieldError>}
      {hint && hintVariant !== 'error' && (
        <FieldDescription
          className={cn(
            hintVariant === 'success' && 'text-green-600 dark:text-green-400',
          )}
        >
          {hint}
        </FieldDescription>
      )}
    </Field>
  );
}
