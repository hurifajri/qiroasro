'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
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
  const t = useTranslations('settings_page');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  return (
    <Item asChild>
      <li className="p-0!">
        <ItemContent>
          <ItemTitle>
            <Label
              htmlFor={preference.id}
              className="cursor-pointer font-normal text-base"
            >
              {t(preference.labelKey)}
            </Label>
          </ItemTitle>
        </ItemContent>
        <ItemContent>
          <Switch
            id={preference.id}
            checked={preference.enabled}
            onCheckedChange={(checked) => onToggle(preference.id, checked)}
            dir={dir}
          />
        </ItemContent>
      </li>
    </Item>
  );
}
