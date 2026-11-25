export interface PreferenceToggle {
  id: string;
  labelKey: string;
  descriptionKey?: string;
  enabled: boolean;
}

export interface SettingsLink {
  id: string;
  labelKey: string;
  href: string;
}

export interface NotificationCheckbox {
  id: string;
  labelKey: string;
  checked: boolean;
}

export interface DailyReminder {
  id: string;
  labelKey: string;
  checked: boolean;
  time: string;
}

export interface SocialAccount {
  id: string;
  labelKey: string;
  connected: boolean;
}

export interface PrivacySetting {
  id: string;
  labelKey: string;
  descriptionKey: string;
  enabled: boolean;
}
