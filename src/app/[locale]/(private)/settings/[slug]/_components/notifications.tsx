'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
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
import type {
  DailyReminder,
  NotificationCheckbox,
} from '../../_schemas/settings';
import { NotificationCheckboxRow } from './notification-checkbox-row';

interface NotificationsProps {
  generalNotifications: NotificationCheckbox[];
  dailyReminder: DailyReminder;
}

export function Notifications({
  generalNotifications,
  dailyReminder,
}: NotificationsProps) {
  const t = useTranslations('settings_page.notifications');

  const [notifications, setNotifications] =
    useState<NotificationCheckbox[]>(generalNotifications);
  const [reminder, setReminder] = useState<DailyReminder>(dailyReminder);

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, checked } : notif)),
    );
  };

  const handleReminderChange = (checked: boolean) => {
    setReminder((prev) => ({ ...prev, checked }));
  };

  const handleTimeChange = (time: string) => {
    setReminder((prev) => ({ ...prev, time }));
  };

  return (
    <div className="flex flex-col gap-12">
      {/* General notifications section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">{t('general.title')}</h2>
          <span className="text-muted-foreground text-sm">{t('email')}</span>
        </div>
        <Separator />
        <FieldGroup className="gap-4">
          {notifications.map((notification) => (
            <NotificationCheckboxRow
              key={notification.id}
              notification={notification}
              onCheckedChange={handleNotificationChange}
            />
          ))}
        </FieldGroup>
      </section>

      {/* Daily reminders section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">{t('daily_reminders.title')}</h2>
          <span className="text-muted-foreground text-sm">{t('email')}</span>
        </div>
        <Separator />
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <FieldLabel htmlFor={reminder.id}>
              {t(reminder.labelKey)}
            </FieldLabel>
            <Checkbox
              id={reminder.id}
              checked={reminder.checked}
              onCheckedChange={(checked) =>
                handleReminderChange(checked as boolean)
              }
            />
          </Field>
          {reminder.checked && (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="reminder_time" className="sr-only">
                  {t('daily_reminders.reminder_time')}
                </FieldLabel>
              </FieldContent>
              <Select value={reminder.time} onValueChange={handleTimeChange}>
                <SelectTrigger id="reminder_time" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="05:00">5:00 AM</SelectItem>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        </FieldGroup>
      </section>
    </div>
  );
}
