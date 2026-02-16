import type { InferOutput } from 'valibot';
import { boolean, object, optional, string } from 'valibot';

/**
 * Preference Toggle Schema
 */
export const PreferenceToggleSchema = object({
  id: string(),
  labelKey: string(),
  descriptionKey: optional(string()),
  enabled: boolean(),
});

export type PreferenceToggle = InferOutput<typeof PreferenceToggleSchema>;

/**
 * Settings Link Schema
 */
export const SettingsLinkSchema = object({
  id: string(),
  labelKey: string(),
  href: string(),
});

export type SettingsLink = InferOutput<typeof SettingsLinkSchema>;

/**
 * Profile Form Schema
 */
export const ProfileFormSchema = object({
  name: string(),
  username: string(),
  email: string(),
  avatarColorCode: optional(string()),
});

export type ProfileForm = InferOutput<typeof ProfileFormSchema>;

/**
 * Notification Checkbox Schema
 */
export const NotificationCheckboxSchema = object({
  id: string(),
  labelKey: string(),
  checked: boolean(),
});

export type NotificationCheckbox = InferOutput<
  typeof NotificationCheckboxSchema
>;

/**
 * Daily Reminder Schema
 */
export const DailyReminderSchema = object({
  id: string(),
  labelKey: string(),
  checked: boolean(),
  time: string(), // e.g., "17:00" for 5PM
});

export type DailyReminder = InferOutput<typeof DailyReminderSchema>;

/**
 * Social Account Schema
 */
export const SocialAccountSchema = object({
  id: string(),
  labelKey: string(),
  connected: boolean(),
});

export type SocialAccount = InferOutput<typeof SocialAccountSchema>;

/**
 * Privacy Setting Schema
 */
export const PrivacySettingSchema = object({
  id: string(),
  labelKey: string(),
  descriptionKey: string(),
  enabled: boolean(),
});

export type PrivacySetting = InferOutput<typeof PrivacySettingSchema>;
