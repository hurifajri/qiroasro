'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import type { SocialAccount } from '../../_schemas/settings';

interface SocialAccountsProps {
  accounts: SocialAccount[];
}

export function SocialAccounts({ accounts }: SocialAccountsProps) {
  const t = useTranslations('settings_page.social_accounts');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  const [socialAccounts, setSocialAccounts] =
    useState<SocialAccount[]>(accounts);

  const handleToggle = (id: string, connected: boolean) => {
    setSocialAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, connected } : account,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <FieldGroup className="gap-4">
          {socialAccounts.map((account) => (
            <Field key={account.id} orientation="horizontal">
              <FieldLabel htmlFor={account.id}>
                {t(account.labelKey)}
              </FieldLabel>
              <Switch
                id={account.id}
                checked={account.connected}
                onCheckedChange={(checked) => handleToggle(account.id, checked)}
                dir={dir}
              />
            </Field>
          ))}
        </FieldGroup>
      </section>
    </div>
  );
}
