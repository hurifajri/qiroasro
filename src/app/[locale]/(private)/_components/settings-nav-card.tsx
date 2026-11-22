import { ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { SettingsLink } from '@/app/[locale]/(private)/settings/_schemas/settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface SettingsNavCardProps {
  titleKey: string;
  links: SettingsLink[];
  activeId?: string;
}

export function SettingsNavCard({
  titleKey,
  links,
  activeId,
}: Readonly<SettingsNavCardProps>) {
  const t = useTranslations('global.private_layout');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-1">
          {links.map((link) => (
            <Item key={link.id} asChild>
              <li
                className={cn(
                  'hover:bg-muted',
                  activeId === link.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground',
                )}
              >
                <Link
                  href={link.href}
                  className="flex w-full items-center gap-2"
                >
                  <ItemContent>
                    <ItemTitle>{t(link.labelKey)}</ItemTitle>
                  </ItemContent>
                  <ItemContent className="shrink-0">
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </ItemContent>
                </Link>
              </li>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
