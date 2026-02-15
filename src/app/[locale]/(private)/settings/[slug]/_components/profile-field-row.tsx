'use client';

import { useTranslations } from 'next-intl';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface ProfileFieldRowProps {
  id: string;
  labelKey: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  placeholder?: string;
}

export function ProfileFieldRow({
  id,
  labelKey,
  value,
  onChange,
  type = 'text',
  placeholder,
}: ProfileFieldRowProps) {
  const t = useTranslations('settings_page.profile.personal_info');

  return (
    <Field>
      <FieldContent>
        <FieldLabel htmlFor={id} className="text-base">
          {t(labelKey)}
        </FieldLabel>
      </FieldContent>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Field>
  );
}
