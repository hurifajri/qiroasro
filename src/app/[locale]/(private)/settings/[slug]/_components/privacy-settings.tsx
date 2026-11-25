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
import type { PrivacySetting } from '@/features/user-profile/schemas/settings';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

interface PrivacySettingsProps {
  settings: PrivacySetting[];
}

export function PrivacySettings({ settings }: Readonly<PrivacySettingsProps>) {
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
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4">
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
      </div>

      <Button onClick={handleSaveChanges} className="w-fit">
        {t('save_changes')}
      </Button>
    </div>
  );
}
