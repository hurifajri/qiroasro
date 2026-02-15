import type { LucideIcon } from 'lucide-react';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Link } from '@/i18n/navigation';

interface AddFriendsRowProps {
  href: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconClass: string;
  labelKey: string;
}

export function AddFriendsRow({
  href,
  icon: Icon,
  iconBgClass,
  iconClass,
  labelKey,
}: AddFriendsRowProps) {
  const t = useTranslations('global.private_layout.profile_sidebar');

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
