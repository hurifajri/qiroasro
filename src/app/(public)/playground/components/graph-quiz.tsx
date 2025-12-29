import { TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function GraphQuiz() {
  const t = useTranslations('playground_page.quiz');

  return (
    <Button
      id="tour-waitlist-button"
      onClick={() => console.log('quiz time')}
      className="cursor-pointer bg-linear-to-r from-accent-sky to-accent-sky-dark text-base text-white"
    >
      <TrophyIcon />
      {t('trigger')}
    </Button>
  );
}
