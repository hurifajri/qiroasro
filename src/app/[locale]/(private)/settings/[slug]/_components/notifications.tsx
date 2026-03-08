'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  DailyReminder,
  NotificationCheckbox,
} from '../../_schemas/settings';

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

  const timeOptions = [
    { value: '05:00', label: '5:00 AM' },
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '21:00', label: '9:00 PM' },
  ];

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
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-xl">{t('general.title')}</h2>
          <span className="text-muted-foreground text-sm">{t('email')}</span>
        </div>
        <FieldGroup className="gap-4">
          {notifications.map((notification) => (
            <Field key={notification.id} orientation="horizontal">
              <FieldLabel htmlFor={notification.id}>
                {t(notification.labelKey)}
              </FieldLabel>
              <Checkbox
                id={notification.id}
                checked={notification.checked}
                onCheckedChange={(checked) =>
                  handleNotificationChange(notification.id, checked as boolean)
                }
              />
            </Field>
          ))}
        </FieldGroup>
      </section>

      {/* Daily reminders section */}
      <section className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="font-bold text-xl">{t('daily_reminders.title')}</h2>
          <span className="text-muted-foreground text-sm">{t('email')}</span>
        </div>
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
              <FieldLabel htmlFor="reminder_time" className="sr-only">
                {t('daily_reminders.reminder_time')}
              </FieldLabel>
              <Select value={reminder.time} onValueChange={handleTimeChange}>
                <SelectTrigger id="reminder_time" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
