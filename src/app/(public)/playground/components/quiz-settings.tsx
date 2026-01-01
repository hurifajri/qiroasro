'use client';

import { SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export interface QuizSettingsValues {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
}

interface QuizSettingsProps {
  values: QuizSettingsValues;
  onChange: (values: QuizSettingsValues) => void;
}

export function QuizSettings({ values, onChange }: QuizSettingsProps) {
  const t = useTranslations('playground_page.quiz');

  const handleLettersChange = (value: number | readonly number[]) => {
    const newLetters = Array.isArray(value) ? value[0] : value;
    // If letters equals targets, adjust targets
    if (newLetters === values.targetsPerQuiz) {
      const adjustedTargets = newLetters < 5 ? newLetters + 1 : newLetters - 1;
      onChange({ ...values, lettersPerQuiz: newLetters, targetsPerQuiz: adjustedTargets });
    } else {
      onChange({ ...values, lettersPerQuiz: newLetters });
    }
  };

  const handleTargetsChange = (value: number | readonly number[]) => {
    const newTargets = Array.isArray(value) ? value[0] : value;
    // If targets equals letters, adjust letters
    if (newTargets === values.lettersPerQuiz) {
      const adjustedLetters = newTargets < 5 ? newTargets + 1 : newTargets - 1;
      onChange({ ...values, targetsPerQuiz: newTargets, lettersPerQuiz: adjustedLetters });
    } else {
      onChange({ ...values, targetsPerQuiz: newTargets });
    }
  };

  const handleMultiEdgeChange = (checked: boolean) => {
    onChange({ ...values, multiEdge: checked });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <SettingsIcon className="size-4" />
        <span className="font-medium text-sm">{t('settings')}</span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Letters per Quiz */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('letters_per_quiz')}</Label>
            <span className="font-medium text-sm">{values.lettersPerQuiz}</span>
          </div>
          <Slider
            value={[values.lettersPerQuiz]}
            onValueChange={handleLettersChange}
            min={1}
            max={5}
            step={1}
          />
        </div>

        {/* Targets per Quiz */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('targets_per_quiz')}</Label>
            <span className="font-medium text-sm">{values.targetsPerQuiz}</span>
          </div>
          <Slider
            value={[values.targetsPerQuiz]}
            onValueChange={handleTargetsChange}
            min={1}
            max={5}
            step={1}
          />
        </div>

        {/* Multi Edge */}
        <div className="flex items-center justify-between">
          <Label className="text-sm">{t('multi_edge')}</Label>
          <Switch checked={values.multiEdge} onCheckedChange={handleMultiEdgeChange} />
        </div>
      </div>
    </div>
  );
}
