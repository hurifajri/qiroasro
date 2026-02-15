import { ChevronRightIcon, SearchIcon, UserPlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Link } from '@/i18n/navigation';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search: SearchIcon,
  UserPlus: UserPlusIcon,
};

interface AddFriendsRowProps {
  href: string;
  iconName: string;
  iconBgClass: string;
  iconClass: string;
  labelKey: string;
}

export function AddFriendsRow({
  href,
  iconName,
  iconBgClass,
  iconClass,
  labelKey,
}: AddFriendsRowProps) {
  const t = useTranslations('global.private_layout.profile_sidebar');
  const Icon = iconMap[iconName];

  return (
    <Item asChild>
      <li className="p-0!">
        <Link href={href} className="flex w-full items-center gap-2">
          <ItemMedia variant="icon">
            <div className={iconBgClass}>
              <Icon className={iconClass} />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{t(labelKey)}</ItemTitle>
          </ItemContent>
          <ItemContent className="shrink-0">
            <ChevronRightIcon className="text-muted-foreground" />
          </ItemContent>
        </Link>
      </li>
    </Item>
  );
}
