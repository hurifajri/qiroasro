import { CheckCircle2Icon, RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface QuizFooterProps {
  isUnsupportedConfig: boolean;
  isChecked: boolean;
  connectionCount: number;
  requiredConnections: number;
  onReset: () => void;
  onTryAgain: () => void;
  onCheckAnswers: () => void;
  timerMode?: boolean;
  timeRemaining?: number | null;
}

export function QuizFooter({
  isUnsupportedConfig,
  isChecked,
  connectionCount,
  requiredConnections,
  onReset,
  onTryAgain,
  onCheckAnswers,
}: QuizFooterProps) {
  const t = useTranslations('playground_page.quiz');

  return (
    <DialogFooter className="sm:justify-between! flex-col gap-2 sm:flex-row sm:items-center">
      <Button size="lg" variant="outline" onClick={onReset}>
        <RefreshCwIcon />
        {t('change_mode')}
      </Button>
      {!isUnsupportedConfig && isChecked && (
        <Button size="lg" onClick={onTryAgain}>
          <RefreshCwIcon />
          {t('try_again')}
        </Button>
      )}
      {!isUnsupportedConfig && !isChecked && (
        <Button size="lg" onClick={onCheckAnswers} disabled={connectionCount < requiredConnections}>
          <CheckCircle2Icon />
          {t('check_answer')}
        </Button>
      )}
    </DialogFooter>
  );
}
