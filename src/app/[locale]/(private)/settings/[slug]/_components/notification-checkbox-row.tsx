'use client';

import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import type { NotificationCheckbox } from '../../_schemas/settings';

interface NotificationCheckboxRowProps {
  notification: NotificationCheckbox;
  onCheckedChange: (id: string, checked: boolean) => void;
}

export function NotificationCheckboxRow({
  notification,
  onCheckedChange,
}: NotificationCheckboxRowProps) {
  const t = useTranslations('settings_page.notifications');

  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor={notification.id}>
        {t(notification.labelKey)}
      </FieldLabel>
      <Checkbox
        id={notification.id}
        checked={notification.checked}
        onCheckedChange={(checked) =>
          onCheckedChange(notification.id, checked as boolean)
        }
      />
    </Field>
  );
}
