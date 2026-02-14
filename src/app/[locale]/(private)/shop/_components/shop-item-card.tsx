import { GemIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { ShopItem } from '../_schemas/shop';

interface ShopItemCardProps {
  item: ShopItem;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const t = useTranslations('shop_page');

  const renderAction = () => {
    if (item.status === 'full') {
      return (
        <Badge variant="secondary" className="font-bold">
          {t('status.full')}
        </Badge>
      );
    }

    if (item.status === 'super') {
      return (
        <Button variant="default" size="sm" className="font-bold">
          {t('status.get_super')}
        </Button>
      );
    }

    // Available - show price
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 font-bold text-primary"
      >
        <span>{t('status.get_for')}</span>
        <GemIcon className="size-4 fill-primary" />
        <span>{item.price}</span>
      </Button>
    );
  };

  const showEquipped = item.type === 'powerup' && item.maxEquipped > 0;

  return (
    <Item asChild>
      <li className="px-0! py-0!">
        {/* Icon */}
        <ItemMedia
          variant="icon"
          className="translate-0! self-center! flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl"
        >
          {item.iconEmoji}
        </ItemMedia>

        {/* Content */}
        <ItemContent>
          <ItemTitle>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">{t(item.titleKey)}</h4>
              {showEquipped && (
                <Badge variant="secondary" className="text-xs">
                  {item.equipped} / {item.maxEquipped} {t('status.equipped')}
                </Badge>
              )}
            </div>
          </ItemTitle>
          <ItemDescription className="text-muted-foreground text-xs">
            {t(item.descriptionKey)}
          </ItemDescription>
        </ItemContent>

        {/* Action */}
        <ItemContent className={cn('shrink-0')}>{renderAction()}</ItemContent>
      </li>
    </Item>
  );
}
