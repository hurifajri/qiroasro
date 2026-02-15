'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ItemGroup } from '@/components/ui/item';
import {
  Select,
  SelectContent,
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
        <ItemGroup>
          {preferences.map((preference) => (
            <PreferenceToggleRow
              key={preference.id}
              preference={preference}
              onToggle={handleToggle}
            />
          ))}
        </ItemGroup>
      </section>

      {/* Appearance section */}
      <section className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">{t('appearance.title')}</h2>
        <Separator />
        <div className="flex flex-col gap-3">
          <label htmlFor="theme" className="font-normal text-base">
            {t('appearance.dark_mode')}
          </label>
          <Select value={appearanceMode} onValueChange={setAppearanceMode}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">{t('appearance.mode_off')}</SelectItem>
              <SelectItem value="on">{t('appearance.mode_on')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </div>
  );
}
