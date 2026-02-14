import { ItemGroup } from '@/components/ui/item';
import type { ShopItem } from '../_schemas/shop';
import { ShopItemCard } from './shop-item-card';

interface ShopSectionProps {
  title: string;
  items: ShopItem[];
}

export function ShopSection({ title, items }: ShopSectionProps) {
  return (
    <section>
      <h2 className="mb-4 font-bold text-xl">{title}</h2>
      <ItemGroup className="gap-0">
        {items.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </ItemGroup>
    </section>
  );
}
