'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import type { ShopItem } from '../_schemas/shop';
import { ShopSection } from './shop-section';

interface ShopProps {
  heartsItems: ShopItem[];
  powerupItems: ShopItem[];
}

export function Shop({ heartsItems, powerupItems }: ShopProps) {
  const t = useTranslations('shop_page');

  return (
    <div className="flex flex-col gap-6">
      {/* Hearts Section */}
      <ShopSection title={t('sections.hearts')} items={heartsItems} />

      <Separator />

      {/* Power-Ups Section */}
      <ShopSection title={t('sections.powerups')} items={powerupItems} />
    </div>
  );
}
