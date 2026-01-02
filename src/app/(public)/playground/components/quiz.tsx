'use client';

import {
  type Edge,
  type Node,
  type NodeTypes,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { PlayIcon, TrophyIcon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';
import { useChallengeTimer } from '../hooks/use-challenge-timer';
import { useQuizGenerator } from '../hooks/use-quiz-generator';
import { useQuizTimer } from '../hooks/use-quiz-timer';
import { useQuizStore } from '../providers/quiz';
import { CHALLENGE_MODE_CONFIG, type QuizMode } from '../schemas/quiz';
import { ChallengeDifficultySelector } from './challenge-difficulty-selector';
import { ChallengeProgress } from './challenge-progress';
import { ChallengeResults } from './challenge-results';
import { LetterQuizNode } from './node-letter-quiz';
import { TargetQuizNode } from './node-target-quiz';
import { PointAnimation } from './point-animation';
import { QuizCanvas } from './quiz-canvas';
import { QuizFooter } from './quiz-footer';
import { QuizInstruction } from './quiz-instruction';
import { QuizModeSelector } from './quiz-mode-selector';
import { QuizScore } from './quiz-score';
import { QuizSettings } from './quiz-settings';
import { QuizTimer } from './quiz-timer';

const nodeTypes: NodeTypes = {
  letterQuiz: LetterQuizNode,
  targetQuiz: TargetQuizNode,
};

const TOTAL_CHALLENGE_QUESTION = 10;

export function Quiz() {
  const t = useTranslations('playground_page.quiz');
  const theme = useGlobalStore((s) => s.theme);

  // Zustand store state - using granular selectors for performance
  const mode = useQuizStore((s) => s.mode);
  const setMode = useQuizStore((s) => s.setMode);
  const settings = useQuizStore((s) => s.settings);
  const setSettings = useQuizStore((s) => s.setSettings);
  const isDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const openDialog = useQuizStore((s) => s.openDialog);
  const isStarted = useQuizStore((s) => s.isStarted);
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const isChecked = useQuizStore((s) => s.isChecked);
  const _setIsChecked = useQuizStore((s) => s.setIsChecked);
  const isUnsupportedConfig = useQuizStore((s) => s.isUnsupportedConfig);
  const isInstructionShown = useQuizStore((s) => s.isInstructionShown);
  const setIsInstructionShown = useQuizStore((s) => s.setIsInstructionShown);
  const score = useQuizStore((s) => s.score);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const resetAll = useQuizStore((s) => s.resetAll);

  // Challenge state
  const isChallengeMode = useQuizStore((s) => s.isChallengeMode);
  const enterChallengeMode = useQuizStore((s) => s.enterChallengeMode);
  const challengeDifficulty = useQuizStore((s) => s.challengeDifficulty);
  const selectChallengeDifficulty = useQuizStore((s) => s.selectChallengeDifficulty);
  const currentQuestionIndex = useQuizStore((s) => s.currentQuestionIndex);
  const questionStat = useQuizStore((s) => s.questionStat);
  const challengeScoring = useQuizStore((s) => s.challengeScoring);
  const challengeResult = useQuizStore((s) => s.challengeResult);
  const lastPointChange = useQuizStore((s) => s.lastPointChange);
  const startChallenge = useQuizStore((s) => s.startChallenge);
  const nextChallengeQuestion = useQuizStore((s) => s.nextChallengeQuestion);
  const addConnectionScore = useQuizStore((s) => s.addConnectionScore);
  const recordQuestionStat = useQuizStore((s) => s.recordQuestionStat);
  const _addErrorItem = useQuizStore((s) => s.addErrorItem);
  const finishChallenge = useQuizStore((s) => s.finishChallenge);
  const resetChallenge = useQuizStore((s) => s.resetChallenge);

  // ReactFlow-specific state (nodes/edges managed by ReactFlow hooks)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {
    generateQuiz,
    isValidConnection,
    onConnect,
    checkAnswers,
    connectionCount,
    requiredConnections,
  } = useQuizGenerator({
    nodes,
    edges,
    setNodes,
    setEdges,
  });

  // Get current challenge config
  const currentChallengeConfig = useMemo(() => {
    if (!isChallengeMode || !challengeDifficulty) return null;
    return CHALLENGE_MODE_CONFIG[challengeDifficulty];
  }, [isChallengeMode, challengeDifficulty]);

  const currentQuestion = useMemo(() => {
    if (!currentChallengeConfig) return null;
    return currentChallengeConfig.question[currentQuestionIndex];
  }, [currentChallengeConfig, currentQuestionIndex]);

  // Regular quiz timer
  const handleTimeUp = useCallback(() => {
    if (!isChecked) {
      checkAnswers();
    }
  }, [isChecked, checkAnswers]);

  const {
    timeRemaining,
    start: startTimer,
    reset: resetTimer,
    stop: stopTimer,
  } = useQuizTimer({
    duration: settings.timerDuration,
    enabled: settings.timerMode && !isChallengeMode,
    onTimeUp: handleTimeUp,
    isPaused: isChecked,
  });

  // Challenge timer - auto advance on timeout
  const handleChallengeTimeUp = useCallback(() => {
    // Record current question as timeout (all incorrect)
    const stat = {
      correctConnection: score.correct,
      incorrectConnection: requiredConnections - score.correct,
      timeSpent: currentChallengeConfig?.timerDuration
        ? currentChallengeConfig.timerDuration * 1000
        : 0,
      isPerfect: false,
    };
    recordQuestionStat(stat);

    // Add incorrect scores for unanswered connections
    const missedConnections = requiredConnections - connectionCount;
    for (let i = 0; i < missedConnections; i++) {
      addConnectionScore(false);
    }

    // Move to next or finish
    if (currentQuestionIndex >= TOTAL_CHALLENGE_QUESTION - 1) {
      finishChallenge(
        challengeScoring.correctConnection +
          challengeScoring.incorrectConnection +
          missedConnections,
      );
    } else {
      nextChallengeQuestion();
    }
  }, [
    score.correct,
    requiredConnections,
    currentChallengeConfig,
    recordQuestionStat,
    connectionCount,
    addConnectionScore,
    currentQuestionIndex,
    finishChallenge,
    challengeScoring,
    nextChallengeQuestion,
  ]);

  const {
    timeRemaining: challengeTimeRemaining,
    start: startChallengeTimer,
    reset: resetChallengeTimer,
    stop: stopChallengeTimer,
    getElapsedTime,
  } = useChallengeTimer({
    duration: currentChallengeConfig?.timerDuration ?? 60,
    enabled: isChallengeMode && isStarted && !challengeResult,
    onTimeUp: handleChallengeTimeUp,
    isPaused: isChecked,
  });

  // Generate challenge question when index changes
  useEffect(() => {
    if (isChallengeMode && isStarted && currentQuestion && !challengeResult) {
      // Configure settings for this question
      setSettings({
        lettersPerQuiz: currentQuestion.lettersPerQuiz,
        targetsPerQuiz: currentQuestion.targetsPerQuiz,
        multiEdge: currentQuestion.allowMultiEdge,
        timerMode: true,
        timerDuration: currentChallengeConfig?.timerDuration ?? 60,
      });

      // Generate the quiz
      generateQuiz(currentQuestion.mode);
      setMode(currentQuestion.mode);
      resetChallengeTimer();

      if (currentQuestionIndex === 0) {
        startChallengeTimer();
      }
    }
  }, [
    isChallengeMode,
    isStarted,
    currentQuestionIndex,
    currentQuestion,
    challengeResult,
    currentChallengeConfig,
    setSettings,
    generateQuiz,
    setMode,
    resetChallengeTimer,
    startChallengeTimer,
  ]);

  // Handle challenge answer check and move to next question
  const handleChallengeCheckAndNext = useCallback(() => {
    checkAnswers();

    // Wait for state update then record and move to next
    setTimeout(() => {
      // Use current score from the store's reactive state
      const currentScore = score;
      const timeSpent = getElapsedTime();
      const isPerfect = currentScore.correct === currentScore.total;

      const stat = {
        correctConnection: currentScore.correct,
        incorrectConnection: currentScore.total - currentScore.correct,
        timeSpent,
        isPerfect,
      };
      recordQuestionStat(stat);

      // Add scores for each connection
      for (let i = 0; i < currentScore.correct; i++) {
        addConnectionScore(true);
      }
      for (let i = 0; i < currentScore.total - currentScore.correct; i++) {
        addConnectionScore(false);
      }

      // Small delay before moving to next question
      setTimeout(() => {
        if (currentQuestionIndex >= TOTAL_CHALLENGE_QUESTION - 1) {
          const totalConnections =
            challengeScoring.correctConnection +
            challengeScoring.incorrectConnection +
            currentScore.correct +
            (currentScore.total - currentScore.correct);
          finishChallenge(totalConnections);
        } else {
          nextChallengeQuestion();
        }
      }, 1000);
    }, 100);
  }, [
    checkAnswers,
    score,
    getElapsedTime,
    recordQuestionStat,
    addConnectionScore,
    currentQuestionIndex,
    challengeScoring,
    finishChallenge,
    nextChallengeQuestion,
  ]);

  // Mode selection handlers
  const handleModeSelect = (selectedMode: QuizMode) => {
    setMode(selectedMode);
  };

  const handleChallengeSelect = () => {
    enterChallengeMode();
  };

  const handleDifficultySelect = (difficulty: typeof challengeDifficulty) => {
    if (difficulty) {
      selectChallengeDifficulty(difficulty);
    }
  };

  const handleStartChallenge = () => {
    startChallenge();
  };

  const handleStartQuiz = () => {
    if (!mode) return;
    startQuiz();
    generateQuiz(mode);
    startTimer();
  };

  const handleBackToModeSelect = () => {
    setMode(null);
    resetChallenge();
  };

  const handleBackToDifficultySelect = () => {
    resetChallenge();
    enterChallengeMode();
  };

  const handleResetQuiz = () => {
    setNodes([]);
    setEdges([]);
    resetQuiz();
    stopTimer();
    stopChallengeTimer();
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      handleResetQuiz();
      resetChallenge();
      resetAll();
    }
  };

  const handlePlayAgain = () => {
    handleResetQuiz();
    resetChallenge();
    // Keep challenge mode and difficulty selected
    if (challengeDifficulty) {
      enterChallengeMode();
      selectChallengeDifficulty(challengeDifficulty);
    }
  };

  const handleBackToMenu = () => {
    handleResetQuiz();
    resetChallenge();
    resetAll();
  };

  // Determine title and description based on state
  const getDialogTitle = () => {
    if (isChallengeMode) {
      if (challengeResult) return t('challenge_result');
      if (!challengeDifficulty) return t('select_difficulty');
      if (!isStarted) return t('mode_challenge');
      return t('mode_challenge');
    }
    if (!mode) return t('select_mode');
    if (!isStarted) return t('settings');
    return t(`title_${mode}`);
  };

  const getDialogDescription = () => {
    if (isChallengeMode) {
      if (challengeResult) return '';
      if (!challengeDifficulty) return t('select_mode_description');
      if (!isStarted) return t(`difficulty_${challengeDifficulty}_desc`);
      // When quiz is active, show the current question type description
      return mode ? t(`description_${mode}`) : '';
    }
    if (!mode) return t('select_mode_description');
    if (!isStarted)
      return t('settings_description', {
        mode: mode === 'articulation_point' ? 'makhraj' : 'sifat',
      });
    return t(`description_${mode}`);
  };

  // Determine current screen
  const showModeSelection = !mode && !isChallengeMode;
  const showDifficultySelection = isChallengeMode && !challengeDifficulty;
  const showChallengeReady = isChallengeMode && challengeDifficulty && !isStarted;
  const showChallengeResults = isChallengeMode && challengeResult;
  const showChallengeQuiz = isChallengeMode && isStarted && !challengeResult;
  const showRegularSettings = !isChallengeMode && mode && !isStarted;
  const showRegularQuiz = !isChallengeMode && mode && isStarted;

  return (
    <ReactFlowProvider>
      <Button
        id="tour-quiz"
        size="sm"
        onClick={openDialog}
        className="bg-linear-to-r from-accent-sky to-accent-sky-dark text-white"
      >
        <TrophyIcon className="size-4" />
        {t('trigger')}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>

          {/* Point animation for challenge mode */}
          {isChallengeMode && <PointAnimation lastPointChange={lastPointChange} />}

          {/* Step 1: Mode Selection */}
          {showModeSelection && (
            <QuizModeSelector
              onSelect={handleModeSelect}
              onChallengeSelect={handleChallengeSelect}
            />
          )}

          {/* Challenge: Difficulty Selection */}
          {showDifficultySelection && (
            <div className="flex flex-col gap-4">
              <ChallengeDifficultySelector onSelect={handleDifficultySelect} />
              <Button variant="outline" onClick={handleBackToModeSelect}>
                {t('back')}
              </Button>
            </div>
          )}

          {/* Challenge: Ready to Start */}
          {showChallengeReady && (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  {t('question_of', { current: 10, total: 10 })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackToDifficultySelect} className="flex-1">
                  {t('back')}
                </Button>
                <Button onClick={handleStartChallenge} className="flex-1">
                  <PlayIcon className="size-4" />
                  {t('start_quiz')}
                </Button>
              </div>
            </div>
          )}

          {/* Challenge: Results */}
          {showChallengeResults && challengeResult && (
            <ChallengeResults
              result={challengeResult}
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
          )}

          {/* Challenge: Active Quiz */}
          {showChallengeQuiz && (
            <>
              {isUnsupportedConfig ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <XCircleIcon className="h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">{t('unsupported_quiz')}</p>
                </div>
              ) : (
                <div className="relative flex flex-col gap-2">
                  {/* Challenge Progress */}
                  <ChallengeProgress
                    currentIndex={currentQuestionIndex}
                    totalQuestion={TOTAL_CHALLENGE_QUESTION}
                    questionStat={questionStat}
                  />

                  {/* Timer and Score */}
                  <div className={cn('flex h-9 items-center justify-between gap-2')}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {t('point', { point: challengeScoring.totalPoint })}
                      </span>
                    </div>
                    {challengeTimeRemaining !== null && (
                      <QuizTimer timeRemaining={challengeTimeRemaining} />
                    )}
                  </div>

                  <QuizCanvas
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    theme={theme}
                    isChecked={isChecked}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    isValidConnection={isValidConnection}
                  />

                  {isInstructionShown && mode && (
                    <QuizInstruction quizMode={mode} onClose={() => setIsInstructionShown(false)} />
                  )}
                </div>
              )}

              {/* Challenge Footer */}
              <div className="flex gap-2">
                <Button
                  onClick={handleChallengeCheckAndNext}
                  disabled={connectionCount < requiredConnections || isChecked}
                  className="flex-1"
                >
                  {currentQuestionIndex >= TOTAL_CHALLENGE_QUESTION - 1
                    ? t('check_answer')
                    : t('check_answer')}
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Regular Settings (after mode selected, before quiz started) */}
          {showRegularSettings && (
            <div className="flex flex-col gap-4">
              <QuizSettings />
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackToModeSelect} className="flex-1">
                  {t('back')}
                </Button>
                <Button onClick={handleStartQuiz} className="flex-1">
                  <PlayIcon className="size-4" />
                  {t('start_quiz')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Regular Quiz Started */}
          {showRegularQuiz && (
            <>
              {isUnsupportedConfig ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <XCircleIcon className="h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">{t('unsupported_quiz')}</p>
                </div>
              ) : (
                <div className="relative flex flex-col gap-2">
                  <div
                    className={cn(
                      'flex h-9 items-center gap-2',
                      isChecked ? 'justify-between' : 'justify-end',
                    )}
                  >
                    {isChecked && <QuizScore score={score} />}
                    {settings.timerMode && timeRemaining !== null && !isChecked && (
                      <QuizTimer timeRemaining={timeRemaining} />
                    )}
                  </div>

                  <QuizCanvas
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    theme={theme}
                    isChecked={isChecked}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    isValidConnection={isValidConnection}
                  />

                  {isInstructionShown && mode && (
                    <QuizInstruction quizMode={mode} onClose={() => setIsInstructionShown(false)} />
                  )}
                </div>
              )}

              <QuizFooter
                isUnsupportedConfig={isUnsupportedConfig}
                isChecked={isChecked}
                connectionCount={connectionCount}
                requiredConnections={requiredConnections}
                onReset={handleResetQuiz}
                onTryAgain={() => {
                  generateQuiz(mode);
                  resetTimer();
                }}
                onCheckAnswers={checkAnswers}
                timerMode={settings.timerMode}
                timeRemaining={timeRemaining}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </ReactFlowProvider>
  );
}
