'use client';

import { useQuery } from '@tanstack/react-query';
import { SettingsIcon, TimerIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { getLeafLetters } from '@/features/tajweed-graph/lib/letter';
import { getPlaygroundDataOpt } from '@/features/tajweed-graph/queries/tajweed-graph';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

import { useQuizStore } from '../_providers/quiz';
import {
  PRACTICE_QUIZ_TYPE_CONFIG,
  type PracticeQuizSettings,
} from '../_schemas/quiz';

type SliderKey = 'lettersPerQuiz' | 'targetsPerQuiz';

const SLIDER_CONFIG: { key: SliderKey; labelKey: string }[] = [
  { key: 'lettersPerQuiz', labelKey: 'practice_letters_per_quiz' },
  { key: 'targetsPerQuiz', labelKey: 'practice_targets_per_quiz' },
];

function resolveMultiEdge(
  current: boolean,
  primaryCount: number,
  allowMultiEdge: boolean,
): boolean {
  return primaryCount <= 2 || !allowMultiEdge ? false : current;
}

function getLettersSliderUpdate(
  newValue: number,
  practiceSettings: PracticeQuizSettings,
  allowMultiEdge: boolean,
): PracticeQuizSettings {
  if (newValue > 1) {
    return {
      ...practiceSettings,
      lettersPerQuiz: newValue,
      targetsPerQuiz: 1,
      multiEdge: resolveMultiEdge(
        practiceSettings.multiEdge,
        newValue,
        allowMultiEdge,
      ),
      specificLetterId: null,
    };
  }

  const newTargets =
    practiceSettings.targetsPerQuiz === 1 ? 2 : practiceSettings.targetsPerQuiz;
  return {
    ...practiceSettings,
    lettersPerQuiz: newValue,
    targetsPerQuiz: newTargets,
    multiEdge: resolveMultiEdge(
      practiceSettings.multiEdge,
      newTargets,
      allowMultiEdge,
    ),
  };
}

function getTargetsSliderUpdate(
  newValue: number,
  practiceSettings: PracticeQuizSettings,
  allowMultiEdge: boolean,
): PracticeQuizSettings {
  if (newValue > 1) {
    return {
      ...practiceSettings,
      targetsPerQuiz: newValue,
      lettersPerQuiz: 1,
      multiEdge: resolveMultiEdge(
        practiceSettings.multiEdge,
        newValue,
        allowMultiEdge,
      ),
    };
  }

  const newLetters =
    practiceSettings.lettersPerQuiz === 1 ? 2 : practiceSettings.lettersPerQuiz;
  return {
    ...practiceSettings,
    targetsPerQuiz: newValue,
    lettersPerQuiz: newLetters,
    multiEdge: resolveMultiEdge(
      practiceSettings.multiEdge,
      newLetters,
      allowMultiEdge,
    ),
    specificLetterId: null,
  };
}

type QuizSettingsProps = Readonly<{
  hasHeader?: boolean;
}>;

export function QuizSettings({ hasHeader = false }: QuizSettingsProps) {
  const t = useTranslations('playground_page.quiz');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  const type = useQuizStore((s) => s.type);
  const practiceSettings = useQuizStore((s) => s.practiceSettings);
  const setPracticeSettings = useQuizStore((s) => s.setPracticeSettings);

  // Fetch playground data
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());

  // Only quizzable letters (waw/ya are represented by their variant nodes)
  const memoizedLetters = useMemo(
    () => getLeafLetters(playgroundData?.letters ?? []),
    [playgroundData?.letters],
  );

  // Get config for current type (default to trait if no type selected)
  const config = type
    ? PRACTICE_QUIZ_TYPE_CONFIG[type]
    : PRACTICE_QUIZ_TYPE_CONFIG.trait;

  const handleSliderChange = (
    key: SliderKey,
    value: number | readonly number[],
  ) => {
    const newValue = typeof value === 'number' ? value : (value[0] ?? 1);
    const nextSettings =
      key === 'lettersPerQuiz'
        ? getLettersSliderUpdate(
            newValue,
            practiceSettings,
            config.allowMultiEdge,
          )
        : getTargetsSliderUpdate(
            newValue,
            practiceSettings,
            config.allowMultiEdge,
          );
    setPracticeSettings(nextSettings);
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

  const hasSpecificLetter = practiceSettings.specificLetterId !== null;
  const isMultiLetter = practiceSettings.lettersPerQuiz !== 1;

  const handleEnableSpecificLetter = () => {
    // Set first letter when toggling ON (fallback to ID 1 if letters not loaded)
    const firstLetterId = memoizedLetters[0]?.id ?? 1;
    setPracticeSettings({
      ...practiceSettings,
      specificLetterId: firstLetterId,
    });
  };

  const handleDisableSpecificLetter = () => {
    setPracticeSettings({
      ...practiceSettings,
      specificLetterId: null,
    });
  };

  const handleLetterClick = (letterId: number) => {
    // Single selection - toggle off if same letter clicked, otherwise select new letter
    if (practiceSettings.specificLetterId === letterId) {
      // Don't allow deselecting - keep at least one selected
      return;
    }
    setPracticeSettings({
      ...practiceSettings,
      specificLetterId: letterId,
    });
  };

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
                  {key === 'lettersPerQuiz'
                    ? t(labelKey)
                    : t(`${labelKey}_${type}`)}
                </Label>
                <span className="text-sm font-medium">
                  {practiceSettings[key]}
                </span>
              </div>
              <Slider
                dir={dir}
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
              dir={dir}
              checked={practiceSettings.multiEdge}
              disabled={isMultiEdgeDisabled}
              onCheckedChange={(checked) =>
                setPracticeSettings({ ...practiceSettings, multiEdge: checked })
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('practice_specific_letters')}</Label>
            <Switch
              dir={dir}
              checked={hasSpecificLetter && !isMultiLetter}
              disabled={isMultiLetter}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleEnableSpecificLetter();
                } else {
                  handleDisableSpecificLetter();
                }
              }}
            />
          </div>

          {hasSpecificLetter && !isMultiLetter && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {t('practice_specific_letters_hint')}
              </p>
              <div className="flex flex-wrap gap-1">
                {memoizedLetters.map((letter) => {
                  const isSelected =
                    practiceSettings.specificLetterId === letter.id;
                  return (
                    <Button
                      key={letter.id}
                      variant={isSelected ? 'default' : 'outline'}
                      size="icon"
                      className="size-8 font-arabic text-base"
                      onClick={() => handleLetterClick(letter.id)}
                    >
                      {letter.symbol}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1 text-sm">
              <TimerIcon className="size-5 shrink-0" />
              {t('practice_timer_mode')}
            </Label>
            <Switch
              dir={dir}
              checked={practiceSettings.timerMode}
              onCheckedChange={(checked) =>
                setPracticeSettings({ ...practiceSettings, timerMode: checked })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">
                {t('practice_timer_duration')}
              </Label>
              <span className="text-sm font-medium">
                {practiceSettings.timerDuration}
              </span>
            </div>
            <Slider
              dir={dir}
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
