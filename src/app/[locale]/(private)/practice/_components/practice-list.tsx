import { useTranslations } from 'next-intl';

import { ItemGroup } from '@/components/ui/item';

import type { PracticeMode, PracticeSection } from '../../_schemas/practice';
import { PracticeItem } from './practice-item';

interface PracticeListProps {
  section: PracticeSection;
  onSelectMode: (mode: PracticeMode) => void;
}

export function PracticeList({
  section,
  onSelectMode,
}: Readonly<PracticeListProps>) {
  const t = useTranslations('practice_page');

  return (
    <li className="flex flex-col gap-3">
      <h3 className="font-bold">{t(section.titleKey)}</h3>
      <ItemGroup>
        {section.modes.map((mode) => (
          <PracticeItem key={mode.id} mode={mode} onSelectMode={onSelectMode} />
        ))}
      </ItemGroup>
    </li>
  );
}
