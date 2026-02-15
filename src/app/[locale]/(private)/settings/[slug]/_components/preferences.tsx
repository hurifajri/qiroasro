'use client';

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
import type { PreferenceToggle } from '../../_schemas/settings';
import { PreferenceToggleRow } from './preference-toggle-row';

interface PreferencesProps {
  lessonPreferences: PreferenceToggle[];
  defaultAppearanceMode: string;
}

export function Preferences({
  lessonPreferences,
  defaultAppearanceMode,
}: PreferencesProps) {
  const t = useTranslations('settings_page');
  const [preferences, setPreferences] =
    useState<PreferenceToggle[]>(lessonPreferences);
  const [appearanceMode, setAppearanceMode] = useState(defaultAppearanceMode);

  const handleToggle = (id: string, enabled: boolean) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled } : pref)),
    );
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Lesson experience section */}
      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">{t('lesson_experience.title')}</h2>
        <Separator />
        <FieldGroup className="gap-2">
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
      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">{t('appearance.title')}</h2>
        <Separator />
        <Field>
          <FieldContent>
            <FieldLabel htmlFor="theme" className="text-base">
              {t('appearance.dark_mode')}
            </FieldLabel>
          </FieldContent>
          <Select value={appearanceMode} onValueChange={setAppearanceMode}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="off">{t('appearance.mode_off')}</SelectItem>
                <SelectItem value="on">{t('appearance.mode_on')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </section>
    </div>
  );
}
