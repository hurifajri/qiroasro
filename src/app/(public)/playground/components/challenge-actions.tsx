'use client';

import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { CopyIcon, PlayIcon, ShareIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { parseDuration } from '@/lib/utils';
import type { ChallengeQuizResult } from '../schemas/quiz';

interface ChallengeActionsProps {
  result: ChallengeQuizResult;
  resultRef: React.RefObject<HTMLDivElement | null>;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ChallengeActions = memo(function ChallengeActions({
  result,
  resultRef,
  onPlayAgain,
  onBackToMenu,
}: ChallengeActionsProps) {
  const t = useTranslations('playground_page.quiz');
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const duration = parseDuration(result.totalTime);
    const shareText = t('challenge_share_text', {
      point: result.score.totalPoint,
      difficulty: t(`challenge_difficulty_${result.difficulty}`),
      minutes: duration.minutes,
      seconds: duration.seconds,
    });
    const shareUrl = `${env.NEXT_PUBLIC_APP_URL}/playground`;

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
        const shareData: ShareData = {
          title: 'Qiroasro Challenge',
          text: shareText,
          url: shareUrl,
        };

        if (imageFile && navigator.canShare?.({ files: [imageFile] })) {
          shareData.files = [imageFile];
        }

        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}. ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard failed
    }
  }, [result, resultRef, t]);

  return (
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
  );
});
