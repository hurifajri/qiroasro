import type {
  DailyReminder,
  NotificationCheckbox,
  PreferenceToggle,
  PrivacySetting,
  ProfileForm,
  SettingsLink,
  SocialAccount,
} from '../_schemas/settings';

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
    labelKey: 'account.preferences',
    href: '/settings/preferences',
  },
  {
    id: 'profile',
    labelKey: 'account.profile',
    href: '/settings/profile',
  },
  {
    id: 'notifications',
    labelKey: 'account.notifications',
    href: '/settings/notifications',
  },
  {
    id: 'social',
    labelKey: 'account.social',
    href: '/settings/social',
  },
  {
    id: 'privacy',
    labelKey: 'account.privacy',
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
 * Mock profile data
 */
export const MOCK_PROFILE_DATA: ProfileForm = {
  name: 'Baba Huri Haura',
  username: 'hurifajri',
  email: 'hurifajri@gmail.com',
  avatarColorCode: 'indigo',
};

/**
 * Mock general notification settings
 */
export const MOCK_GENERAL_NOTIFICATIONS: NotificationCheckbox[] = [
  {
    id: 'product_updates',
    labelKey: 'general.product_updates',
    checked: false,
  },
  {
    id: 'new_follower',
    labelKey: 'general.new_follower',
    checked: false,
  },
  {
    id: 'friend_activity',
    labelKey: 'general.friend_activity',
    checked: false,
  },
  {
    id: 'weekly_progress',
    labelKey: 'general.weekly_progress',
    checked: false,
  },
  {
    id: 'special_promotions',
    labelKey: 'general.special_promotions',
    checked: false,
  },
  {
    id: 'research_participation',
    labelKey: 'general.research_participation',
    checked: true,
  },
];

/**
 * Mock daily reminder settings
 */
export const MOCK_DAILY_REMINDER: DailyReminder = {
  id: 'practice_reminder',
  labelKey: 'daily_reminders.practice_reminder',
  checked: true,
  time: '17:00',
};

/**
 * Mock social accounts
 */
export const MOCK_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'facebook',
    labelKey: 'facebook',
    connected: false,
  },
  {
    id: 'google',
    labelKey: 'google',
    connected: true,
  },
];

/**
 * Mock privacy settings
 */
export const MOCK_PRIVACY_SETTINGS: PrivacySetting[] = [
  {
    id: 'make_profile_public',
    labelKey: 'make_profile_public',
    descriptionKey: 'make_profile_public_description',
    enabled: true,
  },
  {
    id: 'personalized_ads',
    labelKey: 'personalized_ads',
    descriptionKey: 'personalized_ads_description',
    enabled: true,
  },
  {
    id: 'friend_streaks',
    labelKey: 'friend_streaks',
    descriptionKey: 'friend_streaks_description',
    enabled: true,
  },
];
