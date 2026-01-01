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
    // Case 1: letters = 1, targets > 1 → if letters increased, targets must reset to 1
    // Case 2: letters > 1, targets = 1 → valid
    // Rule: one must be 1, but not both
    if (newLetters > 1) {
      // If letters > 1, targets must be 1
      onChange({ ...values, lettersPerQuiz: newLetters, targetsPerQuiz: 1 });
    } else {
      // If letters = 1, targets must be > 1 (at least 2)
      const newTargets = values.targetsPerQuiz === 1 ? 2 : values.targetsPerQuiz;
      onChange({ ...values, lettersPerQuiz: newLetters, targetsPerQuiz: newTargets });
    }
  };

  const handleTargetsChange = (value: number | readonly number[]) => {
    const newTargets = Array.isArray(value) ? value[0] : value;
    // Case 1: letters = 1, targets > 1 → valid
    // Case 2: letters > 1, targets = 1 → if targets increased, letters must reset to 1
    // Rule: one must be 1, but not both
    if (newTargets > 1) {
      // If targets > 1, letters must be 1
      onChange({ ...values, targetsPerQuiz: newTargets, lettersPerQuiz: 1 });
    } else {
      // If targets = 1, letters must be > 1 (at least 2)
      const newLetters = values.lettersPerQuiz === 1 ? 2 : values.lettersPerQuiz;
      onChange({ ...values, targetsPerQuiz: newTargets, lettersPerQuiz: newLetters });
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
