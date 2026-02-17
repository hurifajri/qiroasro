import type { ShopItem } from '../_schemas/shop';

/**
 * Mock Hearts items
 */
export const MOCK_HEARTS_ITEMS: ShopItem[] = [
  {
    id: 'refill-hearts',
    titleKey: 'hearts.refill.title',
    descriptionKey: 'hearts.refill.description',
    emoji: '❤️',
    price: 0,
    type: 'hearts',
    status: 'full',
    equipped: 1,
    maxEquipped: 2,
  },
  {
    id: 'unlimited-hearts',
    titleKey: 'hearts.unlimited.title',
    descriptionKey: 'hearts.unlimited.description',
    emoji: '♾️',
    price: 0,
    type: 'hearts',
    status: 'super',
    equipped: 1,
    maxEquipped: 2,
  },
];

/**
 * Mock Power-Ups items
 */
export const MOCK_POWERUP_ITEMS: ShopItem[] = [
  {
    id: 'streak-freeze',
    titleKey: 'powerups.streak_freeze.title',
    descriptionKey: 'powerups.streak_freeze.description',
    emoji: '🧊',
    price: 200,
    type: 'powerup',
    status: 'available',
    equipped: 1,
    maxEquipped: 2,
  },
  {
    id: 'double-xp',
    titleKey: 'powerups.double_xp.title',
    descriptionKey: 'powerups.double_xp.description',
    emoji: '⚡',
    price: 400,
    type: 'powerup',
    status: 'available',
    equipped: 0,
    maxEquipped: 1,
  },
];
