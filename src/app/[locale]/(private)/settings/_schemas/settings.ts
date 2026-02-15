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
