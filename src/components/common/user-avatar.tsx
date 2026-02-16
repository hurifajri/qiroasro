import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarColorClass, getInitials } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  colorCode?: string | null;
  size?: 'sm' | 'default' | 'lg';
  hasOnlineBadge?: boolean;
  isOnline?: boolean;
  className?: string;
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
}: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColorClass = getAvatarColorClass(colorCode);

  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn(bgColorClass, 'text-white')}>
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
