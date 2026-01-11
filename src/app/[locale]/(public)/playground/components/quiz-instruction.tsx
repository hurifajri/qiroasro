import { InfoIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { QuizType } from '../schemas/quiz';

interface QuizInstructionProps {
  quizType: QuizType | null;
  onClose?: () => void;
}

export function QuizInstruction({ quizType, onClose }: QuizInstructionProps) {
  const t = useTranslations('playground_page.quiz');

  return (
    <Card className="gap-0 rounded-lg bg-linear-to-br from-lime-300/60 to-lime-300/40 px-3 py-2 text-foreground dark:from-lime-800/60 dark:to-lime-800/40">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-1 text-sm">
          <InfoIcon className="size-4" />
          {t('practice_instruction_title')}
        </CardTitle>
        {!!onClose && (
          <CardAction>
            <XIcon onClick={onClose} className="size-4 cursor-pointer" />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-0">
        <p className="text-sm">
          {quizType
            ? t('practice_instruction_description', {
                target: quizType === 'articulation_point' ? 'makhraj' : 'sifat',
              })
            : t('challenge_instruction_description')}
        </p>
      </CardContent>
    </Card>
  );
}
