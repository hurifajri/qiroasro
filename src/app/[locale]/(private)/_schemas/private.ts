import type { AvatarColorCode } from '@/lib/avatar';

export interface NavItem {
  id: string;
  labelKey: string;
  iconName: string;
  href: string;
  isActive: boolean;
}

export interface UserStatus {
  emoji: string;
  label: string;
}

export interface ActivityFeedItem {
  id: string;
  userName: string;
  avatarColorCode?: AvatarColorCode;
  activityDate: string;
  descriptionKey: string;
  reactionEmojis: string[];
  reactionCount: number;
}

export interface FollowEntry {
  id: string;
  name: string;
  avatarColorCode?: AvatarColorCode;
  xp: number;
  isOnline: boolean;
}
