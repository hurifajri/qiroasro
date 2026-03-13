import { ItemGroup } from '@/components/ui/item';
import type { ShopItem } from '../_schemas/shop';
import { ShopItemCard } from './shop-item-card';

interface ShopSectionProps {
  title: string;
  items: ShopItem[];
}

export function ShopSection({ title, items }: ShopSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-bold text-lg">{title}</h2>
      <ItemGroup>
        {items.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </ItemGroup>
    </section>
  );
}
