import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { QuizMode } from '../schemas/quiz';

interface QuizModeSelectorProps {
  onSelect: (mode: QuizMode) => void;
}

export function QuizModeSelector({ onSelect }: QuizModeSelectorProps) {
  const t = useTranslations('playground_page.quiz');

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => onSelect('articulation_point')}
        variant="outline"
        className="h-20 text-lg"
      >
        <span className="text-2xl">🎯</span>
        {t('mode_articulation_point')}
      </Button>
      <Button onClick={() => onSelect('trait')} variant="outline" className="h-20 text-lg">
        <span className="text-2xl">✨</span>
        {t('mode_trait')}
      </Button>
    </div>
  );
}
