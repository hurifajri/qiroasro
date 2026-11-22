export type ShopItemType = 'hearts' | 'powerup';

export type ShopItemStatus = 'available' | 'full' | 'super';

export interface ShopItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
  price: number;
  type: ShopItemType;
  status: ShopItemStatus;
  equipped: number;
  maxEquipped: number;
}
