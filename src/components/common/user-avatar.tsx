import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarColorClass, getInitials } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  colorCode?: string | null;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

/**
 * Reusable user avatar component with initial letter + background color
 */
export function UserAvatar({
  name,
  colorCode,
  size = 'default',
  className,
}: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColorClass = getAvatarColorClass(colorCode);

  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn(bgColorClass, 'text-white')}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
