'use client';

import { SettingsIcon, TimerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useQuizStore } from '../providers/quiz';
import { QUIZ_MODE_CONFIG } from '../schemas/quiz';

type SliderKey = 'lettersPerQuiz' | 'targetsPerQuiz';

const SLIDER_CONFIG: { key: SliderKey; labelKey: string }[] = [
  { key: 'lettersPerQuiz', labelKey: 'regular_letters_per_quiz' },
  { key: 'targetsPerQuiz', labelKey: 'regular_targets_per_quiz' },
];

interface QuizSettingsProps {
  hasHeader?: boolean;
}

export function QuizSettings({ hasHeader = false }: QuizSettingsProps) {
  const t = useTranslations('playground_page.quiz');

  const mode = useQuizStore((s) => s.mode);
  const settings = useQuizStore((s) => s.settings);
  const setSettings = useQuizStore((s) => s.setSettings);

  // Get config for current mode (default to trait if no mode selected)
  const config = mode ? QUIZ_MODE_CONFIG[mode] : QUIZ_MODE_CONFIG.trait;

  const handleSliderChange = (key: SliderKey, value: number | readonly number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;

    if (key === 'lettersPerQuiz') {
      if (newValue > 1) {
        // letters > 1 means targets = 1, so multiEdge only valid if letters > 2
        const shouldResetMultiEdge = newValue <= 2 || !config.allowMultiEdge;
        setSettings({
          ...settings,
          lettersPerQuiz: newValue,
          targetsPerQuiz: 1,
          multiEdge: shouldResetMultiEdge ? false : settings.multiEdge,
        });
      } else {
        const newTargets = settings.targetsPerQuiz === 1 ? 2 : settings.targetsPerQuiz;
        // letters = 1, targets > 1, multiEdge valid if targets > 2
        const shouldResetMultiEdge = newTargets <= 2 || !config.allowMultiEdge;
        setSettings({
          ...settings,
          lettersPerQuiz: newValue,
          targetsPerQuiz: newTargets,
          multiEdge: shouldResetMultiEdge ? false : settings.multiEdge,
        });
      }
    } else {
      if (newValue > 1) {
        // targets > 1 means letters = 1, so multiEdge only valid if targets > 2
        const shouldResetMultiEdge = newValue <= 2 || !config.allowMultiEdge;
        setSettings({
          ...settings,
          targetsPerQuiz: newValue,
          lettersPerQuiz: 1,
          multiEdge: shouldResetMultiEdge ? false : settings.multiEdge,
        });
      } else {
        const newLetters = settings.lettersPerQuiz === 1 ? 2 : settings.lettersPerQuiz;
        // targets = 1, letters > 1, multiEdge valid if letters > 2
        const shouldResetMultiEdge = newLetters <= 2 || !config.allowMultiEdge;
        setSettings({
          ...settings,
          targetsPerQuiz: newValue,
          lettersPerQuiz: newLetters,
          multiEdge: shouldResetMultiEdge ? false : settings.multiEdge,
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
    !config.allowMultiEdge || (settings.lettersPerQuiz <= 2 && settings.targetsPerQuiz <= 2);

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
                  {t(labelKey, { target: mode === 'articulation_point' ? 'Makhraj' : 'Sifat' })}
                </Label>
                <span className="font-medium text-sm">{settings[key]}</span>
              </div>
              <Slider
                value={[settings[key]]}
                onValueChange={(v) => handleSliderChange(key, v)}
                min={sliderRange.min}
                max={sliderRange.max}
                step={1}
              />
            </div>
          );
        })}

        {mode === 'trait' && (
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('regular_multi_edge')}</Label>
            <Switch
              checked={settings.multiEdge}
              disabled={isMultiEdgeDisabled}
              onCheckedChange={(checked) => setSettings({ ...settings, multiEdge: checked })}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1 text-sm">
              <TimerIcon className="size-5 shrink-0" />
              {t('regular_timer_mode')}
            </Label>
            <Switch
              checked={settings.timerMode}
              onCheckedChange={(checked) => setSettings({ ...settings, timerMode: checked })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm">{t('regular_timer_duration')}</Label>
              <span className="font-medium text-sm">{settings.timerDuration}</span>
            </div>
            <Slider
              value={[settings.timerDuration]}
              onValueChange={(v) =>
                setSettings({
                  ...settings,
                  timerDuration: Array.isArray(v) ? v[0] : v,
                })
              }
              min={5}
              max={60}
              step={5}
              disabled={!settings.timerMode}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
