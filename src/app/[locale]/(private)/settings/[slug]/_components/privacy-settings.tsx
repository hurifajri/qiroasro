'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import type { PrivacySetting } from '../../_schemas/settings';

interface PrivacySettingsProps {
  settings: PrivacySetting[];
}

export function PrivacySettings({ settings }: PrivacySettingsProps) {
  const t = useTranslations('settings_page.privacy');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  const [privacySettings, setPrivacySettings] =
    useState<PrivacySetting[]>(settings);

  const handleToggle = (id: string, enabled: boolean) => {
    setPrivacySettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled } : setting,
      ),
    );
  };

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    console.log('Save privacy settings:', privacySettings);
  };

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <FieldGroup className="gap-4">
          {privacySettings.map((setting) => (
            <Field key={setting.id} orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={setting.id}>
                  {t(setting.labelKey)}
                </FieldLabel>
                <FieldDescription>{t(setting.descriptionKey)}</FieldDescription>
              </FieldContent>
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={(checked) => handleToggle(setting.id, checked)}
                dir={dir}
              />
            </Field>
          ))}
        </FieldGroup>
      </section>

      <Button onClick={handleSaveChanges} className="w-fit">
        {t('save_changes')}
      </Button>
    </div>
  );
}
