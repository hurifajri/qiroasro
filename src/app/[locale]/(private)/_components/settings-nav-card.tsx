import { ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SettingsLink } from '@/app/[locale]/(private)/settings/_schemas/settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Link } from '@/i18n/navigation';

interface SettingsNavCardProps {
  titleKey: string;
  links: SettingsLink[];
  activeId?: string;
}

export function SettingsNavCard({
  titleKey,
  links,
  activeId,
}: SettingsNavCardProps) {
  const t = useTranslations('settings_page');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(titleKey)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-1">
          {links.map((link) => (
            <Item key={link.id} asChild>
              <Link
                href={link.href}
                className={
                  activeId === link.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground'
                }
              >
                <ItemContent className="flex-1">
                  <ItemTitle>
                    <h4 className="font-normal text-sm">{t(link.labelKey)}</h4>
                  </ItemTitle>
                </ItemContent>
                <ItemContent className="shrink-0">
                  <ChevronRightIcon className="size-5 text-muted-foreground" />
                </ItemContent>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
