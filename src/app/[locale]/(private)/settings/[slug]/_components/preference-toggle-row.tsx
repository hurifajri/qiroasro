'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import type { PreferenceToggle } from '../../_schemas/settings';

interface PreferenceToggleRowProps {
  preference: PreferenceToggle;
  onToggle: (id: string, enabled: boolean) => void;
}

export function PreferenceToggleRow({
  preference,
  onToggle,
}: PreferenceToggleRowProps) {
  const t = useTranslations('settings_page.preferences');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor={preference.id}>
          {t(preference.labelKey)}
        </FieldLabel>
      </FieldContent>
      <Switch
        id={preference.id}
        checked={preference.enabled}
        onCheckedChange={(checked) => onToggle(preference.id, checked)}
        dir={dir}
      />
    </Field>
  );
}
