'use client';

import { InfoIcon, SettingsIcon, TimerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export interface QuizSettingsValues {
  lettersPerQuiz: number;
  targetsPerQuiz: number;
  multiEdge: boolean;
  timerMode: boolean;
  timerDuration: number; // in seconds
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
        // letters > 1 means targets = 1, so multiEdge only valid if letters > 2
        const shouldResetMultiEdge = newValue <= 2;
        onChange({
          ...values,
          lettersPerQuiz: newValue,
          targetsPerQuiz: 1,
          multiEdge: shouldResetMultiEdge ? false : values.multiEdge,
        });
      } else {
        const newTargets = values.targetsPerQuiz === 1 ? 2 : values.targetsPerQuiz;
        // letters = 1, targets > 1, multiEdge valid if targets > 2
        const shouldResetMultiEdge = newTargets <= 2;
        onChange({
          ...values,
          lettersPerQuiz: newValue,
          targetsPerQuiz: newTargets,
          multiEdge: shouldResetMultiEdge ? false : values.multiEdge,
        });
      }
    } else {
      if (newValue > 1) {
        // targets > 1 means letters = 1, so multiEdge only valid if targets > 2
        const shouldResetMultiEdge = newValue <= 2;
        onChange({
          ...values,
          targetsPerQuiz: newValue,
          lettersPerQuiz: 1,
          multiEdge: shouldResetMultiEdge ? false : values.multiEdge,
        });
      } else {
        const newLetters = values.lettersPerQuiz === 1 ? 2 : values.lettersPerQuiz;
        // targets = 1, letters > 1, multiEdge valid if letters > 2
        const shouldResetMultiEdge = newLetters <= 2;
        onChange({
          ...values,
          targetsPerQuiz: newValue,
          lettersPerQuiz: newLetters,
          multiEdge: shouldResetMultiEdge ? false : values.multiEdge,
        });
      }
    }
  };

  return (
    <Card size="sm">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-1">
          <SettingsIcon className="size-5 shrink-0" />
          <span>{t('settings')}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {SLIDER_CONFIG.map(({ key, labelKey }) => (
          <div key={key} className="flex flex-col gap-2">
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
          </div>
        ))}

        <div className="flex items-center justify-between">
          <Label className="text-sm">{t('multi_edge')}</Label>
          <Switch
            checked={values.multiEdge}
            disabled={values.lettersPerQuiz <= 2 && values.targetsPerQuiz <= 2}
            onCheckedChange={(checked) => onChange({ ...values, multiEdge: checked })}
          />
        </div>

        <p className="flex items-start gap-1 border-b pb-4 text-muted-foreground text-xs">
          <InfoIcon className="mt-1 size-3 shrink-0" />
          <span>{t('settings_note')}</span>
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1 text-sm">
              <TimerIcon className="size-5 shrink-0" />
              {t('timer_mode')}
            </Label>
            <Switch
              checked={values.timerMode}
              onCheckedChange={(checked) => onChange({ ...values, timerMode: checked })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm">{t('timer_duration')}</Label>
              <span className="font-medium text-sm">{values.timerDuration}s</span>
            </div>
            <Slider
              value={[values.timerDuration]}
              onValueChange={(v) =>
                onChange({
                  ...values,
                  timerDuration: Array.isArray(v) ? v[0] : v,
                })
              }
              min={5}
              max={60}
              step={5}
              disabled={!values.timerMode}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
