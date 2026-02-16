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
import { SuperButton } from '../../_components/super-button';
import type { ShopItem } from '../_schemas/shop';

interface ShopItemCardProps {
  item: ShopItem;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const t = useTranslations('shop_page');

  const renderAction = () => {
    if (item.status === 'full') {
      return (
        <Badge variant="secondary" className="font-bold uppercase">
          {t('hearts.full')}
        </Badge>
      );
    }

    if (item.status === 'super') {
      return (
        <SuperButton onClick={() => {}} className="uppercase">
          {t('hearts.get_super')}
        </SuperButton>
      );
    }

    // Available - show price
    return (
      <Button variant="outline" size="sm" className="font-bold text-primary">
        <span>{t('powerups.get_for')}</span>
        <GemIcon className="fill-primary" />
        <span>{item.price}</span>
      </Button>
    );
  };

  const showEquipped = item.type === 'powerup' && item.maxEquipped > 0;

  return (
    <Item asChild>
      <li className="p-0!">
        {/* Icon */}
        <ItemMedia className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl">
          {item.iconEmoji}
        </ItemMedia>

        {/* Content */}
        <ItemContent>
          <ItemTitle>
            <div className="flex items-center gap-2 font-bold">
              {t(item.titleKey)}
              {showEquipped && (
                <Badge variant="secondary">
                  {item.equipped} / {item.maxEquipped} {t('powerups.equipped')}
                </Badge>
              )}
            </div>
          </ItemTitle>
          <ItemDescription>{t(item.descriptionKey)}</ItemDescription>
        </ItemContent>

        {/* Action */}
        <ItemContent className="shrink-0">{renderAction()}</ItemContent>
      </li>
    </Item>
  );
}
