'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useMounted } from '@/hooks/use-mounted';
import type { PreferenceToggle } from '../../_schemas/settings';
import { PreferenceToggleRow } from './preference-toggle-row';

interface PreferencesProps {
  lessonPreferences: PreferenceToggle[];
}

export function Preferences({ lessonPreferences }: PreferencesProps) {
  const t = useTranslations();
  const [preferences, setPreferences] =
    useState<PreferenceToggle[]>(lessonPreferences);
  const { theme, setTheme } = useTheme();
  const { isMounted } = useMounted();

  const handleToggle = (id: string, enabled: boolean) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled } : pref)),
    );
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Lesson experience section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">
          {t('settings_page.preferences.lesson_experience.title')}
        </h2>
        <Separator />
        <FieldGroup className="gap-4">
          {preferences.map((preference) => (
            <PreferenceToggleRow
              key={preference.id}
              preference={preference}
              onToggle={handleToggle}
            />
          ))}
        </FieldGroup>
      </section>

      {/* Appearance section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">
          {t('settings_page.preferences.appearance.title')}
        </h2>
        <Separator />
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="theme">
              {t('global.dark_mode.title')}
            </FieldLabel>
          </FieldContent>
          <Select
            value={isMounted ? theme : undefined}
            onValueChange={setTheme}
          >
            <SelectTrigger id="theme" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="system">
                  {t('global.dark_mode.mode_system')}
                </SelectItem>
                <SelectItem value="light">
                  {t('global.dark_mode.mode_off')}
                </SelectItem>
                <SelectItem value="dark">
                  {t('global.dark_mode.mode_on')}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </section>
    </div>
  );
}
