import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { UserAvatar } from '@/components/common/user-avatar';
import { Separator } from '@/components/ui/separator';
import type { Locale } from '@/i18n/routing';
import { getDateLocale } from '@/lib/date';
import type { UserProfile } from '../_schemas/profile';

interface UserInfoProps {
  user: UserProfile;
}

export function UserInfo({ user }: UserInfoProps) {
  const t = useTranslations('profile_page');
  const locale = useLocale() as Locale;

  // Format joined date
  const joinedDateFormatted = format(new Date(user.joinedDate), 'MMMM yyyy', {
    locale: getDateLocale(locale),
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar & Name */}
      <div className="flex items-start gap-4">
        <UserAvatar
          name={user.displayName}
          colorCode={user.avatarColorCode}
          className="size-20"
          textClassName="font-bold text-3xl"
        />

        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-2xl">{user.displayName}</h2>
          <p className="text-muted-foreground">{user.username}</p>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Calendar className="size-4" />
            <span>{t('joined', { date: joinedDateFormatted })}</span>
          </div>
        </div>
      </div>

      {/* Following & Followers */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-primary">{user.followingCount}</span>
          <span className="text-muted-foreground">{t('following')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-primary">{user.followersCount}</span>
          <span className="text-muted-foreground">{t('followers')}</span>
        </div>
      </div>

      <Separator />
    </div>
  );
}
