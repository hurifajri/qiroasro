'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMounted } from '@/hooks/use-mounted';
import { LOCALE_CONFIG } from '@/i18n/config';
import { getLocaleDir } from '@/i18n/locale';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';
import { updateUserLocale } from '@/services/user-locale';
import type { PreferenceToggle } from '../../_schemas/settings';

interface PreferencesProps {
  userId: string;
  lessonPreferences: PreferenceToggle[];
}

export function Preferences({ userId, lessonPreferences }: PreferencesProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [preferences, setPreferences] =
    useState<PreferenceToggle[]>(lessonPreferences);
  const { theme, setTheme } = useTheme();
  const { isMounted } = useMounted();

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale as Locale });
    void updateUserLocale(userId, newLocale);
  };

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
        <FieldGroup className="gap-4">
          {preferences.map((preference) => (
            <Field key={preference.id} orientation="horizontal">
              <FieldLabel htmlFor={preference.id}>
                {t(`settings_page.preferences.${preference.labelKey}`)}
              </FieldLabel>
              <Switch
                dir={dir}
                id={preference.id}
                checked={preference.enabled}
                onCheckedChange={(checked) =>
                  handleToggle(preference.id, checked)
                }
              />
            </Field>
          ))}
        </FieldGroup>
      </section>

      {/* Appearance section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">
          {t('settings_page.preferences.appearance.title')}
        </h2>
        <Field>
          <FieldLabel htmlFor="theme">
            {t('global.color_mode.title')}
          </FieldLabel>
          <Select
            value={isMounted && theme ? theme : 'system'}
            onValueChange={setTheme}
          >
            <SelectTrigger id="theme" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="system">
                  {t('global.color_mode.mode_system')}
                </SelectItem>
                <SelectItem value="light">
                  {t('global.color_mode.mode_light')}
                </SelectItem>
                <SelectItem value="dark">
                  {t('global.color_mode.mode_dark')}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="language">
            {t('global.language.title')}
          </FieldLabel>
          <Select value={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {routing.locales.map((l) => (
                  <SelectItem key={l} value={l}>
                    {LOCALE_CONFIG[l].name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </section>
    </div>
  );
}
