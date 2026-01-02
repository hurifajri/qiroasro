'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  PlayIcon,
  ShareIcon,
  TrophyIcon,
  XCircleIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChallengeResult } from '../schemas/quiz';

interface ChallengeResultsProps {
  result: ChallengeResult;
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
    return { emoji: '🥈', key: 'challenge_badge_great', color: 'text-gray-400' };
  }
  if (accuracy >= 60) {
    return { emoji: '🥉', key: 'challenge_badge_good', color: 'text-amber-600' };
  }
  return { emoji: '📖', key: 'challenge_badge_keep_learning', color: 'text-blue-500' };
}

// Format time from ms to mm:ss
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function ChallengeResults({ result, onPlayAgain, onBackToMenu }: ChallengeResultsProps) {
  const t = useTranslations('playground_page.quiz');
  const resultRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Calculate accuracy
  const accuracy =
    result.totalPossibleConnection > 0
      ? Math.round((result.scoring.correctConnection / result.totalPossibleConnection) * 100)
      : 0;

  const badge = getBadge(accuracy);

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
    const shareText = t('share_text', {
      point: result.scoring.totalPoint,
      difficulty: t(`challenge_difficulty_${result.difficulty}`),
      time: formatTime(result.totalTime),
    });

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/playground` : '';

    // Try to capture image
    let imageFile: File | undefined;
    if (resultRef.current) {
      try {
        const dataUrl = await toPng(resultRef.current, { cacheBust: true });
        const blob = await fetch(dataUrl).then((res) => res.blob());
        imageFile = new File([blob], 'challenge-result.png', { type: 'image/png' });
      } catch {
        // Image capture failed, continue without image
      }
    }

    // Try Web Share API with image
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: 'Qiroasro Challenge',
          text: shareText,
          url: shareUrl,
        };

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
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
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

      <div ref={resultRef} className="flex flex-col gap-4 bg-background p-2">
        {/* Badge and Score Header */}
        <motion.div
          className="flex flex-col items-center gap-2 py-4"
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
          {/* Total Points */}
          <div className="flex flex-col items-center rounded-lg bg-linear-to-br from-primary/10 to-primary/5 p-3">
            <TrophyIcon className="mb-1 size-5 text-primary" />
            <span className="font-bold text-2xl">{result.scoring.totalPoint}</span>
            <span className="text-muted-foreground text-xs">{t('challenge_total_point')}</span>
          </div>

          {/* Total Time */}
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <ClockIcon className="mb-1 size-5 text-muted-foreground" />
            <span className="font-bold text-2xl">{formatTime(result.totalTime)}</span>
            <span className="text-muted-foreground text-xs">{t('challenge_total_time')}</span>
          </div>

          {/* Perfect Questions */}
          <div className="flex flex-col items-center rounded-lg bg-green-50 p-3 dark:bg-green-950">
            <CheckCircleIcon className="mb-1 size-5 text-green-600" />
            <span className="font-bold text-green-700 text-xl dark:text-green-400">
              {result.perfectQuestion}/{result.totalQuestion}
            </span>
            <span className="text-muted-foreground text-xs">{t('challenge_perfect_question')}</span>
          </div>

          {/* Questions with Errors */}
          <div className="flex flex-col items-center rounded-lg bg-red-50 p-3 dark:bg-red-950">
            <XCircleIcon className="mb-1 size-5 text-red-600" />
            <span className="font-bold text-red-700 text-xl dark:text-red-400">
              {result.questionWithError}/{result.totalQuestion}
            </span>
            <span className="text-muted-foreground text-xs">
              {t('challenge_question_with_error')}
            </span>
          </div>
        </motion.div>

        {/* Connection Stats */}
        <motion.div
          className="flex justify-around rounded-lg border p-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold text-green-600 text-lg">
              {result.scoring.correctConnection}
            </span>
            <span className="text-muted-foreground text-xs">
              {t('challenge_correct_connection')}
            </span>
          </div>
          <div className="h-full w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg text-red-600">
              {result.scoring.incorrectConnection}
            </span>
            <span className="text-muted-foreground text-xs">
              {t('challenge_incorrect_connection')}
            </span>
          </div>
          <div className="h-full w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">{accuracy}%</span>
            <span className="text-muted-foreground text-xs">{t('challenge_accuracy')}</span>
          </div>
        </motion.div>

        {/* Weakness Analysis */}
        {result.weakness.length > 0 && (
          <motion.div
            className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <BookOpenIcon className="size-4 text-amber-600" />
              <span className="font-medium text-amber-800 text-sm dark:text-amber-200">
                {t('challenge_weakness_analysis')}
              </span>
            </div>
            <p className="text-amber-700 text-sm dark:text-amber-300">
              {t('challenge_weakness_message', {
                items: result.weakness.map((w) => w.item).join(', '),
              })}
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col gap-2"
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
