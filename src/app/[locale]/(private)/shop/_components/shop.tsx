'use client';

import { useTranslations } from 'next-intl';
import type { ShopItem } from '../_schemas/shop';
import { ShopSection } from './shop-section';

interface ShopProps {
  heartsItems: ShopItem[];
  powerupItems: ShopItem[];
}

export function Shop({ heartsItems, powerupItems }: ShopProps) {
  const t = useTranslations('shop_page');

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {/* Hearts Section */}
      <ShopSection title={t('hearts.title')} items={heartsItems} />

      {/* Power-Ups Section */}
      <ShopSection title={t('powerups.title')} items={powerupItems} />
    </div>
  );
}
