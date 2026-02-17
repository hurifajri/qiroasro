import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  type AvatarColorCode,
  getAvatarColorClass,
  getInitials,
} from '../_lib/avatar';

interface UserAvatarProps {
  name: string;
  colorCode?: AvatarColorCode;
  size?: 'sm' | 'default' | 'lg';
  hasOnlineBadge?: boolean;
  isOnline?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Reusable user avatar component with initial letter + background color
 */
export function UserAvatar({
  name,
  colorCode,
  size = 'default',
  hasOnlineBadge = false,
  isOnline = false,
  className,
  textClassName,
}: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColorClass = getAvatarColorClass(colorCode);

  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn('text-white', bgColorClass, textClassName)}>
        {initials}
      </AvatarFallback>
      {hasOnlineBadge && (
        <AvatarBadge
          className={cn(isOnline ? 'bg-green-500' : 'bg-gray-500')}
        />
      )}
    </Avatar>
  );
}
