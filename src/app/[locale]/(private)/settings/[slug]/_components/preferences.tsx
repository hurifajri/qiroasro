'use client';

import { useForm } from '@tanstack/react-form';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMounted } from '@/hooks/use-mounted';
import { LOCALE_CONFIG } from '@/i18n/config';
import { getLocaleDir } from '@/i18n/locale';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { updateUserLocale } from '@/services/user-locale';
import type { PreferenceToggle } from '../../_schemas/settings';

interface PreferencesProps {
  userId: string;
  lessonPreferences: PreferenceToggle[];
}

type SaveStatus =
  | { type: 'idle' }
  | { type: 'error' | 'success'; messageKey: string };

export function Preferences({ userId, lessonPreferences }: PreferencesProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isMounted } = useMounted();
  const isMaxMd = useMediaQuery('(width < 48rem)');

  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: 'idle' });

  const form = useForm({
    defaultValues: {
      lessonPreferences, // TODO: Refactor so separate state
      theme: theme || 'system',
      locale,
    },
    onSubmit: async ({ value }) => {
      setSaveStatus({ type: 'idle' });

      try {
        if (value.theme !== theme) {
          setTheme(value.theme);
        }

        if (value.locale !== locale) {
          router.replace(pathname, { locale: value.locale as Locale });
          await updateUserLocale(userId, value.locale as Locale);
        }

        setSaveStatus({ type: 'success', messageKey: 'save_success' });
        setTimeout(() => setSaveStatus({ type: 'idle' }), 3000);
      } catch (error) {
        console.error('Failed to save preferences:', error);
        setSaveStatus({ type: 'error', messageKey: 'save_failed' });
      }
    },
  });

  useEffect(() => {
    if (isMounted && theme) {
      form.setFieldValue('theme', theme);
    }
  }, [isMounted, theme, form]);

  return (
    <form
      id="preferences-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto flex max-w-3xl flex-col gap-6"
    >
      {/* Lesson experience */}
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-lg">
          {t('settings_page.preferences.lesson_experience.title')}
        </h2>
        <form.Field name="lessonPreferences">
          {(field) => (
            <FieldGroup className="gap-3">
              {field.state.value.map((preference, index) => (
                <Field key={preference.id} orientation="horizontal">
                  <FieldLabel htmlFor={preference.id}>
                    {t(`settings_page.preferences.${preference.labelKey}`)}
                  </FieldLabel>
                  <Switch
                    dir={dir}
                    id={preference.id}
                    checked={preference.enabled}
                    onCheckedChange={(checked) => {
                      const newValue = [...field.state.value];
                      newValue[index] = {
                        ...newValue[index],
                        enabled: checked,
                      };
                      field.handleChange(newValue);
                    }}
                  />
                </Field>
              ))}
            </FieldGroup>
          )}
        </form.Field>
      </div>

      {/* Appearance */}
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-lg">
          {t('settings_page.preferences.appearance.title')}
        </h2>

        <FieldGroup className="gap-3">
          <form.Field name="theme">
            {(field) => {
              const { meta } = field.state;
              const { isTouched, isValid } = meta;
              const isInvalid = isTouched && !isValid;

              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t('global.color_mode.title')}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="min-w-30"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="system">
                        {t('global.color_mode.mode_system')}
                      </SelectItem>
                      <SelectItem value="light">
                        {t('global.color_mode.mode_light')}
                      </SelectItem>
                      <SelectItem value="dark">
                        {t('global.color_mode.mode_dark')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="locale">
            {(field) => {
              const { meta } = field.state;
              const { isTouched, isValid } = meta;
              const isInvalid = isTouched && !isValid;

              return (
                <Field orientation="responsive" data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t('global.language.title')}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as Locale)
                    }
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="min-w-30"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {routing.locales.map((l) => (
                        <SelectItem key={l} value={l}>
                          {LOCALE_CONFIG[l as Locale].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </div>

      {/* Save button + status */}
      <Field orientation={isMaxMd ? 'vertical' : 'horizontal'}>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              form="preferences-form"
              disabled={isSubmitting}
              className="w-fit"
            >
              {t('settings_page.profile.save_changes')}
            </Button>
          )}
        </form.Subscribe>

        {'messageKey' in saveStatus && (
          <p
            className={cn(
              'text-sm',
              saveStatus.type === 'error' && 'text-destructive',
              saveStatus.type === 'success' &&
                'text-green-600 dark:text-green-400',
            )}
          >
            {t(`settings_page.profile.validation.${saveStatus.messageKey}`)}
          </p>
        )}
      </Field>
    </form>
  );
}
