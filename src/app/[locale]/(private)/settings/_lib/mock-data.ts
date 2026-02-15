import type { PreferenceToggle, SettingsLink } from '../_schemas/settings';

/**
 * Mock lesson experience preferences
 */
export const MOCK_LESSON_PREFERENCES: PreferenceToggle[] = [
  {
    id: 'sound_effects',
    labelKey: 'lesson_experience.sound_effects',
    enabled: true,
  },
  {
    id: 'animations',
    labelKey: 'lesson_experience.animations',
    enabled: true,
  },
  {
    id: 'motivational_messages',
    labelKey: 'lesson_experience.motivational_messages',
    enabled: true,
  },
  {
    id: 'listening_exercises',
    labelKey: 'lesson_experience.listening_exercises',
    enabled: true,
  },
];

/**
 * Mock account navigation links
 */
export const MOCK_ACCOUNT_LINKS: SettingsLink[] = [
  {
    id: 'preferences',
    labelKey: 'settings.preferences',
    href: '/settings/preferences',
  },
  {
    id: 'profile',
    labelKey: 'settings.profile',
    href: '/settings/profile',
  },
  {
    id: 'notifications',
    labelKey: 'settings.notifications',
    href: '/settings/notifications',
  },
  {
    id: 'socialAccounts',
    labelKey: 'settings.social_accounts',
    href: '/settings/social-accounts',
  },
  {
    id: 'privacy',
    labelKey: 'settings.privacy',
    href: '/settings/privacy',
  },
];

/**
 * Mock subscription links
 */
export const MOCK_SUBSCRIPTION_LINKS: SettingsLink[] = [
  {
    id: 'choose_plan',
    labelKey: 'subscription.choose_plan',
    href: '/settings/subscription',
  },
];

/**
 * Mock support links
 */
export const MOCK_SUPPORT_LINKS: SettingsLink[] = [
  {
    id: 'help_center',
    labelKey: 'support.help_center',
    href: '/help',
  },
];

/**
 * Default appearance mode
 */
export const MOCK_APPEARANCE_MODE = 'on';
