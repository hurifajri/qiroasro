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

type SliderKey = 'lettersPerQuiz' | 'targetsPerQuiz';

const SLIDER_CONFIG: { key: SliderKey; labelKey: string }[] = [
  { key: 'lettersPerQuiz', labelKey: 'letters_per_quiz' },
  { key: 'targetsPerQuiz', labelKey: 'targets_per_quiz' },
];

export function QuizSettings({ values, onChange }: QuizSettingsProps) {
  const t = useTranslations('playground_page.quiz');

  const handleSliderChange = (key: SliderKey, value: number | readonly number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;

    if (key === 'lettersPerQuiz') {
      if (newValue > 1) {
        onChange({ ...values, lettersPerQuiz: newValue, targetsPerQuiz: 1 });
      } else {
        const newTargets = values.targetsPerQuiz === 1 ? 2 : values.targetsPerQuiz;
        onChange({ ...values, lettersPerQuiz: newValue, targetsPerQuiz: newTargets });
      }
    } else {
      if (newValue > 1) {
        onChange({ ...values, targetsPerQuiz: newValue, lettersPerQuiz: 1 });
      } else {
        const newLetters = values.lettersPerQuiz === 1 ? 2 : values.lettersPerQuiz;
        onChange({ ...values, targetsPerQuiz: newValue, lettersPerQuiz: newLetters });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <SettingsIcon className="size-4" />
        <span className="font-medium text-sm">{t('settings')}</span>
      </div>

      <ul className="flex flex-col gap-4">
        {SLIDER_CONFIG.map(({ key, labelKey }) => (
          <li key={key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{t(labelKey)}</Label>
              <span className="font-medium text-sm">{values[key]}</span>
            </div>
            <Slider
              value={[values[key]]}
              onValueChange={(v) => handleSliderChange(key, v)}
              min={1}
              max={5}
              step={1}
            />
          </li>
        ))}

        <li className="flex items-center justify-between">
          <Label className="text-sm">{t('multi_edge')}</Label>
          <Switch
            checked={values.multiEdge}
            onCheckedChange={(checked) => onChange({ ...values, multiEdge: checked })}
          />
        </li>
      </ul>
    </div>
  );
}
