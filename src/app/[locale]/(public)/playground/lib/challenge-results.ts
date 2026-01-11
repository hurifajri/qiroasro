import type { ChallengeBadgeConfig } from '../schemas/quiz';

/**
 * Get badge configuration based on accuracy percentage
 */
export function getBadge(accuracy: number): ChallengeBadgeConfig {
  if (accuracy >= 100) {
    return {
      emoji: '🏆',
      key: 'challenge_badge_perfect',
      color: 'text-yellow-500',
    };
  }
  if (accuracy >= 80) {
    return {
      emoji: '🥇',
      key: 'challenge_badge_great',
      color: 'text-gray-400',
    };
  }
  if (accuracy >= 60) {
    return {
      emoji: '🥈',
      key: 'challenge_badge_good',
      color: 'text-amber-600',
    };
  }
  return {
    emoji: '🥉',
    key: 'challenge_badge_keep_learning',
    color: 'text-blue-500',
  };
}

/**
 * Calculate accuracy percentage from quiz result
 */
export function calculateAccuracy(
  correctConnection: number,
  totalPossibleConnection: number,
): number {
  if (totalPossibleConnection <= 0) return 0;
  return Math.round((correctConnection / totalPossibleConnection) * 100);
}
