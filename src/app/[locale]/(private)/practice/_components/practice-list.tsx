import { useTranslations } from 'next-intl';
import { ItemGroup } from '@/components/ui/item';
import type { PracticeSection } from '../_lib/mock-data';
import { PracticeItem } from './practice-item';

interface PracticeListProps {
  section: PracticeSection;
}

export function PracticeList({ section }: PracticeListProps) {
  const t = useTranslations('practice_page');

  return (
    <li className="flex flex-col gap-3">
      <h3 className="font-bold text-lg">{t(section.titleKey)}</h3>
      <ItemGroup className="gap-3">
        {section.modes.map((mode) => (
          <PracticeItem key={mode.id} mode={mode} />
        ))}
      </ItemGroup>
    </li>
  );
}
