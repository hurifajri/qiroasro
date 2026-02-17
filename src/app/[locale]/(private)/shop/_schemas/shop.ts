import type { InferOutput } from 'valibot';
import { integer, literal, number, object, pipe, string, union } from 'valibot';

/**
 * Shop Item Type
 */
export const ShopItemTypeSchema = union([
  literal('hearts'),
  literal('powerup'),
]);

export type ShopItemType = InferOutput<typeof ShopItemTypeSchema>;

/**
 * Shop Item Status
 */
export const ShopItemStatusSchema = union([
  literal('available'),
  literal('full'),
  literal('super'),
]);

export type ShopItemStatus = InferOutput<typeof ShopItemStatusSchema>;

/**
 * Shop Item Schema
 */
export const ShopItemSchema = object({
  id: string(),
  titleKey: string(), // i18n key
  descriptionKey: string(), // i18n key
  emoji: string(),
  price: pipe(number(), integer()), // gems
  type: ShopItemTypeSchema,
  status: ShopItemStatusSchema,
  equipped: pipe(number(), integer()), // for powerups, how many equipped
  maxEquipped: pipe(number(), integer()), // for powerups, max equippable
});

export type ShopItem = InferOutput<typeof ShopItemSchema>;
