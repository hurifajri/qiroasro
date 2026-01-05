'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpenIcon,
  BowArrowIcon,
  CheckCircleIcon,
  CopyIcon,
  PlayIcon,
  ShareIcon,
  TimerIcon,
  TrophyIcon,
  XCircleIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import type { ChallengeQuizResult } from '../schemas/quiz';

interface ChallengeResultsProps {
  result: ChallengeQuizResult;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

// Confetti particle component
function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      initial={{ y: -20, x, opacity: 1, rotate: 0 }}
      animate={{
        y: '100vh',
        x: x + (Math.random() - 0.5) * 200,
        opacity: 0,
        rotate: Math.random() * 720 - 360,
      }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: 'easeOut' }}
      style={{ left: x }}
    >
      <div
        className="size-3 rounded-sm"
        style={{ backgroundColor: color, transform: `rotate(${Math.random() * 45}deg)` }}
      />
    </motion.div>
  );
}

// Badge configuration
function getBadge(accuracy: number) {
  if (accuracy >= 100) {
    return { emoji: '🏆', key: 'challenge_badge_perfect', color: 'text-yellow-500' };
  }
  if (accuracy >= 80) {
    return { emoji: '🥇', key: 'challenge_badge_great', color: 'text-gray-400' };
  }
  if (accuracy >= 60) {
    return { emoji: '🥈', key: 'challenge_badge_good', color: 'text-amber-600' };
  }
  return { emoji: '🥉', key: 'challenge_badge_keep_learning', color: 'text-blue-500' };
}

// Format time from ms to mm:ss
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Stats grid item config
interface StatGridItem {
  icon: LucideIcon;
  value: string;
  labelKey: string;
  bgClass: string;
  iconClass: string;
  valueClass: string;
}

// Connection stat item config
interface ConnectionStatItem {
  value: string;
  labelKey: string;
  valueClass: string;
}

export function ChallengeResults({ result, onPlayAgain, onBackToMenu }: ChallengeResultsProps) {
  const t = useTranslations('playground_page.quiz');
  const resultRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Calculate accuracy
  const accuracy =
    result.totalPossibleConnection > 0
      ? Math.round((result.score.correctConnection / result.totalPossibleConnection) * 100)
      : 0;

  const badge = getBadge(accuracy);

  // Stats grid data
  const statsGridItems: StatGridItem[] = useMemo(
    () => [
      {
        icon: TrophyIcon,
        value: String(result.score.totalPoint),
        labelKey: 'challenge_total_point',
        bgClass: 'bg-indigo-50 dark:bg-indigo-950',
        iconClass: 'text-indigo-600',
        valueClass: 'text-xl text-indigo-700 dark:text-indigo-400',
      },
      {
        icon: TimerIcon,
        value: formatTime(result.totalTime),
        labelKey: 'challenge_total_time',
        bgClass: 'bg-cyan-50 dark:bg-cyan-950',
        iconClass: 'text-cyan-600',
        valueClass: 'text-xl text-cyan-700 dark:text-cyan-400',
      },
      {
        icon: CheckCircleIcon,
        value: `${result.perfectQuestion}/${result.totalQuestion}`,
        labelKey: 'challenge_perfect_question',
        bgClass: 'bg-green-50 dark:bg-green-950',
        iconClass: 'text-green-600',
        valueClass: 'text-xl text-green-700 dark:text-green-400',
      },
      {
        icon: BowArrowIcon,
        value: `${accuracy}%`,
        labelKey: 'challenge_accuracy',
        bgClass: 'bg-amber-50 dark:bg-amber-950',
        iconClass: 'text-amber-600',
        valueClass: 'text-xl text-amber-700 dark:text-amber-400',
      },
    ],
    [result, accuracy],
  );

  // Connection stats data
  const connectionStats: ConnectionStatItem[] = useMemo(
    () => [
      {
        value: String(result.score.correctConnection),
        labelKey: 'challenge_correct_connection',
        valueClass: 'text-green-600',
      },
      {
        value: String(result.score.incorrectConnection),
        labelKey: 'challenge_incorrect_connection',
        valueClass: 'text-red-600',
      },
    ],
    [result.score],
  );

  // Generate confetti particles
  const confettiParticle = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 500),
  }));

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Share functionality
  const handleShare = useCallback(async () => {
    const shareText = t('challenge_share_text', {
      point: result.score.totalPoint,
      difficulty: t(`challenge_difficulty_${result.difficulty}`),
      time: formatTime(result.totalTime),
    });
    const shareUrl = `${env.NEXT_PUBLIC_APP_URL}/playground`;
    const shareContent = `${shareText}\n${shareUrl}`;

    // Try to capture image
    let imageFile: File | undefined;
    if (resultRef.current) {
      try {
        const dataUrl = await toPng(resultRef.current, { cacheBust: true });
        const blob = await fetch(dataUrl).then((res) => res.blob());
        imageFile = new File([blob], 'qiroasro-challenge.png', { type: 'image/png' });
      } catch {
        // Image capture failed, continue without image
      }
    }

    // Try Web Share API with image
    if (navigator.share) {
      try {
        const shareData: ShareData = { title: 'Qiroasro Challenge', text: shareContent };

        // Add image if supported
        if (imageFile && navigator.canShare?.({ files: [imageFile] })) {
          shareData.files = [imageFile];
        }

        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          // Fall through to clipboard
        } else {
          return;
        }
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard failed
    }
  }, [result, t]);

  return (
    <>
      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti &&
          confettiParticle.map((particle) => (
            <ConfettiParticle key={particle.id} delay={particle.delay} x={particle.x} />
          ))}
      </AnimatePresence>

      <div className="h-[calc(100dvh-158px)] overflow-y-auto">
        <div ref={resultRef} className="flex flex-col gap-4 overflow-y-auto bg-background p-4">
          {/* Badge and Score Header */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-6xl">{badge.emoji}</span>
            <span className={cn('font-bold text-2xl', badge.color)}>{t(badge.key)}</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1 text-sm">
                {t(`challenge_difficulty_${result.difficulty}`)}
              </span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statsGridItems.map((stat) => (
              <div
                key={stat.labelKey}
                className={cn('flex flex-col items-center rounded-lg p-3', stat.bgClass)}
              >
                <stat.icon className={cn('mb-1 size-5', stat.iconClass)} />
                <span className={cn('font-bold', stat.valueClass)}>{stat.value}</span>
                <span className="text-muted-foreground text-xs">{t(stat.labelKey)}</span>
              </div>
            ))}
          </motion.div>

          {/* Connection Stats */}
          <motion.div
            className="flex justify-around rounded-lg border p-3 dark:border-muted"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {connectionStats.map((stat) => (
              <div key={stat.labelKey} className="flex flex-col items-center">
                <span className={cn('font-semibold text-lg', stat.valueClass)}>{stat.value}</span>
                <span className="text-muted-foreground text-xs">{t(stat.labelKey)}</span>
              </div>
            ))}
          </motion.div>

          {/* Weakness Analysis */}
          {result.stats.length > 0 && (
            <motion.div
              className="flex flex-col gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Missed connections */}
              {result.stats.filter((s) => s.errorType === 'missed').length > 0 && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
                  <div className="mb-1 flex items-center gap-2">
                    <BookOpenIcon className="size-4 text-yellow-600" />
                    <span className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
                      {t('challenge_weakness_missed')}
                    </span>
                  </div>
                  <p className="text-right font-arabic text-xl text-yellow-700 dark:text-yellow-300">
                    {result.stats
                      .filter((s) => s.errorType === 'missed')
                      .map((s) => s.item)
                      .join(', ')}
                  </p>
                </div>
              )}

              {/* Incorrect connections */}
              {result.stats.filter((s) => s.errorType === 'incorrect').length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                  <div className="mb-1 flex items-center gap-2">
                    <XCircleIcon className="size-4 text-red-600" />
                    <span className="font-medium text-red-800 text-sm dark:text-red-200">
                      {t('challenge_weakness_incorrect')}
                    </span>
                  </div>
                  <p className="text-right font-arabic text-red-700 text-xl dark:text-red-300">
                    {result.stats
                      .filter((s) => s.errorType === 'incorrect')
                      .map((s) => s.item)
                      .join(', ')}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col gap-2 px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" variant="outline" onClick={handleShare} className="w-full">
          {copied ? (
            <>
              <CopyIcon />
              {t('challenge_share_copied')}
            </>
          ) : (
            <>
              <ShareIcon />
              {t('challenge_share_result')}
            </>
          )}
        </Button>
        <div className="flex gap-2">
          <Button size="lg" variant="outline" onClick={onBackToMenu} className="flex-1">
            {t('back')}
          </Button>
          <Button size="lg" onClick={onPlayAgain} className="flex-1">
            <PlayIcon />
            {t('challenge_play_again')}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
