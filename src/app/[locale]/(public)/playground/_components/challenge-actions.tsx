'use client';

import { CopyIcon, PlayIcon, RefreshCwIcon, ShareIcon } from 'lucide-react';
import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { parseDuration } from '@/lib/utils';
import type { ChallengeQuizResult } from '../_schemas/quiz';

interface ChallengeActionsProps {
  result: ChallengeQuizResult;
  resultRef: React.RefObject<HTMLDivElement | null>;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

export function ChallengeActions({
  result,
  resultRef,
  onPlayAgain,
  onChangeMode,
}: ChallengeActionsProps) {
  const t = useTranslations('playground_page.quiz');
  const [copied, setCopied] = useState(false);

  async function handleShare() {
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
        // Lazy load html-to-image
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(resultRef.current, { cacheBust: true });
        const blob = await fetch(dataUrl).then((res) => res.blob());
        imageFile = new File([blob], 'qiroasro-challenge.png', {
          type: 'image/png',
        });
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
        // trackEvent('challenge_result_shared', {
        //   locale,
        //   theme,
        //   difficulty: result.difficulty,
        //   score: result.score.totalPoint,
        //   share_method: 'native',
        // });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}. ${shareUrl}`);
      // trackEvent('challenge_result_shared', {
      //   locale,
      //   theme,
      //   difficulty: result.difficulty,
      //   score: result.score.totalPoint,
      //   share_method: 'clipboard',
      // });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard failed
    }
  }

  return (
    <m.div
      className="flex flex-col gap-2 px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Button
        size="lg"
        variant="outline"
        onClick={handleShare}
        className="w-full"
      >
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
        <Button
          size="lg"
          variant="outline"
          onClick={onChangeMode}
          className="flex-1"
        >
          <RefreshCwIcon />
          {t('change_mode')}
        </Button>
        <Button size="lg" onClick={onPlayAgain} className="flex-1">
          <PlayIcon />
          {t('challenge_play_again')}
        </Button>
      </div>
    </m.div>
  );
}
