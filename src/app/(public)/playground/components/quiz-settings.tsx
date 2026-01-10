'use client';

import { SettingsIcon, TimerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useQuizStore } from '../providers/quiz';
import { PRACTICE_QUIZ_TYPE_CONFIG } from '../schemas/quiz';

type SliderKey = 'lettersPerQuiz' | 'targetsPerQuiz';

const SLIDER_CONFIG: { key: SliderKey; labelKey: string }[] = [
  { key: 'lettersPerQuiz', labelKey: 'practice_letters_per_quiz' },
  { key: 'targetsPerQuiz', labelKey: 'practice_targets_per_quiz' },
];

interface QuizSettingsProps {
  hasHeader?: boolean;
}

export function QuizSettings({ hasHeader = false }: QuizSettingsProps) {
  const t = useTranslations('playground_page.quiz');

  const type = useQuizStore((s) => s.type);
  const practiceSettings = useQuizStore((s) => s.practiceSettings);
  const setPracticeSettings = useQuizStore((s) => s.setPracticeSettings);

  // Get config for current type (default to trait if no type selected)
  const config = type
    ? PRACTICE_QUIZ_TYPE_CONFIG[type]
    : PRACTICE_QUIZ_TYPE_CONFIG.trait;

  const handleSliderChange = (
    key: SliderKey,
    value: number | readonly number[],
  ) => {
    const newValue = Array.isArray(value) ? value[0] : value;

    if (key === 'lettersPerQuiz') {
      if (newValue > 1) {
        // letters > 1 means targets = 1, so multiEdge only valid if letters > 2
        const shouldResetMultiEdge = newValue <= 2 || !config.allowMultiEdge;
        setPracticeSettings({
          ...practiceSettings,
          lettersPerQuiz: newValue,
          targetsPerQuiz: 1,
          multiEdge: shouldResetMultiEdge ? false : practiceSettings.multiEdge,
        });
      } else {
        const newTargets =
          practiceSettings.targetsPerQuiz === 1
            ? 2
            : practiceSettings.targetsPerQuiz;
        // letters = 1, targets > 1, multiEdge valid if targets > 2
        const shouldResetMultiEdge = newTargets <= 2 || !config.allowMultiEdge;
        setPracticeSettings({
          ...practiceSettings,
          lettersPerQuiz: newValue,
          targetsPerQuiz: newTargets,
          multiEdge: shouldResetMultiEdge ? false : practiceSettings.multiEdge,
        });
      }
    } else {
      if (newValue > 1) {
        // targets > 1 means letters = 1, so multiEdge only valid if targets > 2
        const shouldResetMultiEdge = newValue <= 2 || !config.allowMultiEdge;
        setPracticeSettings({
          ...practiceSettings,
          targetsPerQuiz: newValue,
          lettersPerQuiz: 1,
          multiEdge: shouldResetMultiEdge ? false : practiceSettings.multiEdge,
        });
      } else {
        const newLetters =
          practiceSettings.lettersPerQuiz === 1
            ? 2
            : practiceSettings.lettersPerQuiz;
        // targets = 1, letters > 1, multiEdge valid if letters > 2
        const shouldResetMultiEdge = newLetters <= 2 || !config.allowMultiEdge;
        setPracticeSettings({
          ...practiceSettings,
          targetsPerQuiz: newValue,
          lettersPerQuiz: newLetters,
          multiEdge: shouldResetMultiEdge ? false : practiceSettings.multiEdge,
        });
      }
    }
  };

  const getSliderConfig = (key: SliderKey) => {
    if (key === 'lettersPerQuiz') {
      return config.lettersPerQuiz;
    }
    return config.targetsPerQuiz;
  };

  const isMultiEdgeDisabled =
    !config.allowMultiEdge ||
    (practiceSettings.lettersPerQuiz <= 2 &&
      practiceSettings.targetsPerQuiz <= 2);

  return (
    <Card size="sm">
      {hasHeader && (
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-1">
            <SettingsIcon className="size-5 shrink-0" />
            <span>{t('settings')}</span>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent className="flex flex-col gap-4">
        {SLIDER_CONFIG.map(({ key, labelKey }) => {
          const sliderRange = getSliderConfig(key);
          return (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  {t(labelKey, {
                    target: type === 'articulation_point' ? 'Makhraj' : 'Sifat',
                  })}
                </Label>
                <span className="font-medium text-sm">
                  {practiceSettings[key]}
                </span>
              </div>
              <Slider
                value={[practiceSettings[key]]}
                onValueChange={(v) => handleSliderChange(key, v)}
                min={sliderRange.min}
                max={sliderRange.max}
                step={1}
              />
            </div>
          );
        })}

        {type === 'trait' && (
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('practice_multi_edge')}</Label>
            <Switch
              checked={practiceSettings.multiEdge}
              disabled={isMultiEdgeDisabled}
              onCheckedChange={(checked) =>
                setPracticeSettings({ ...practiceSettings, multiEdge: checked })
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1 text-sm">
              <TimerIcon className="size-5 shrink-0" />
              {t('practice_timer_mode')}
            </Label>
            <Switch
              checked={practiceSettings.timerMode}
              onCheckedChange={(checked) =>
                setPracticeSettings({ ...practiceSettings, timerMode: checked })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm">
                {t('practice_timer_duration')}
              </Label>
              <span className="font-medium text-sm">
                {practiceSettings.timerDuration}
              </span>
            </div>
            <Slider
              value={[practiceSettings.timerDuration]}
              onValueChange={(v) =>
                setPracticeSettings({
                  ...practiceSettings,
                  timerDuration: Array.isArray(v) ? v[0] : v,
                })
              }
              min={5}
              max={60}
              step={5}
              disabled={!practiceSettings.timerMode}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
