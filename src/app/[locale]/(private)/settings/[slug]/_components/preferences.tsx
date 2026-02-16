'use client';

import type { ColorMode } from '@xyflow/react';
import { useTranslations } from 'next-intl';
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
import { useRouter } from '@/i18n/navigation';
import { useGlobalStore } from '@/providers/global';
import type { PreferenceToggle } from '../../_schemas/settings';
import { PreferenceToggleRow } from './preference-toggle-row';

interface PreferencesProps {
  lessonPreferences: PreferenceToggle[];
  theme: ColorMode;
}

export function Preferences({ lessonPreferences, theme }: PreferencesProps) {
  const t = useTranslations('settings_page.preferences');
  const router = useRouter();
  const [preferences, setPreferences] =
    useState<PreferenceToggle[]>(lessonPreferences);
  const setTheme = useGlobalStore((s) => s.setTheme);
  const storeTheme = useGlobalStore((s) => s.theme);

  // Use store value (client) after hydration, fallback to server prop
  const currentTheme = storeTheme ?? theme;

  const handleToggle = (id: string, enabled: boolean) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled } : pref)),
    );
  };

  const handleAppearanceChange = (value: ColorMode) => {
    setTheme(value);
    // Refresh to re-render server components with new theme from cookies
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Lesson experience section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">{t('lesson_experience.title')}</h2>
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
        <h2 className="font-bold text-xl">{t('appearance.title')}</h2>
        <Separator />
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="theme">{t('appearance.dark_mode')}</FieldLabel>
          </FieldContent>
          <Select value={currentTheme} onValueChange={handleAppearanceChange}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="system">
                  {t('appearance.mode_system')}
                </SelectItem>
                <SelectItem value="light">
                  {t('appearance.mode_off')}
                </SelectItem>
                <SelectItem value="dark">{t('appearance.mode_on')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </section>
    </div>
  );
}
