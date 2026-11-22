'use server';

import { and, asc, count, desc, eq, gt, lte, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import {
  leagueCohorts,
  leagueParticipants,
  userAchievements,
  userDailyQuests,
  userGamification,
  userMonthlyBadges,
  userXpLedger,
} from '@/db/gamification-schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

import { ACHIEVEMENTS } from '../_lib/achievement';
import { getMonthlyTheme, MONTHLY_BADGES } from '../_lib/badge';
import type { Achievement } from '../_schemas/achievement';
import type { MonthlyBadge } from '../_schemas/badge';
import type { XpLedgerEntry } from '../_schemas/gamification';
import type { LeagueNameKey, Quest, UserStats } from '../_schemas/private';
import type { Statistic } from '../_schemas/user-profile';
import type { MonthlyQuest } from '../quests/_schemas/quests';

const LEAGUE_SLUG_TO_KEY: Record<string, LeagueNameKey> = {
  peace: 'leagues.peace',
  devotion: 'leagues.stability',
  stability: 'leagues.stability',
  knowledge: 'leagues.security',
  security: 'leagues.security',
  sincerity: 'leagues.merit',
  merit: 'leagues.merit',
  humility: 'leagues.honor',
  honor: 'leagues.honor',
  patience: 'leagues.eternity',
  eternity: 'leagues.eternity',
  gratitude: 'leagues.shelter',
  shelter: 'leagues.shelter',
  righteousness: 'leagues.bliss',
  bliss: 'leagues.bliss',
  wisdom: 'leagues.eden',
  eden: 'leagues.eden',
  paradise: 'leagues.paradise',
};

const DEFAULT_USER_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  hearts: 5,
  gems: 0,
  leagueNameKey: 'leagues.peace',
  leagueRank: 0,
};

interface DailyQuestTemplate {
  id: number;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  targetValue: number;
  xpReward: number;
  gemsReward: number;
  iconType: Quest['iconType'];
}

const DEFAULT_DAILY_QUEST_TEMPLATES: readonly DailyQuestTemplate[] = [
  {
    id: 1,
    slug: 'earn_xp',
    titleKey: 'quests.earn_xp.title',
    descriptionKey: 'quests.earn_xp.description',
    targetValue: 10,
    xpReward: 5,
    gemsReward: 2,
    iconType: 'xp',
  },
  {
    id: 2,
    slug: 'high_accuracy',
    titleKey: 'quests.high_accuracy.title',
    descriptionKey: 'quests.high_accuracy.description',
    targetValue: 1,
    xpReward: 10,
    gemsReward: 3,
    iconType: 'accuracy',
  },
  {
    id: 3,
    slug: 'complete_lessons',
    titleKey: 'quests.complete_lessons.title',
    descriptionKey: 'quests.complete_lessons.description',
    targetValue: 3,
    xpReward: 15,
    gemsReward: 5,
    iconType: 'lessons',
  },
];

const QUEST_TEMPLATE_BY_SLUG = new Map(
  DEFAULT_DAILY_QUEST_TEMPLATES.map((template) => [template.slug, template]),
);

function getLeagueNameKey(slug: string | null | undefined): LeagueNameKey {
  if (!slug) return 'leagues.peace';
  return LEAGUE_SLUG_TO_KEY[slug] ?? 'leagues.peace';
}

async function getSessionUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? '';
}

function getCurrentUtcDateInfo() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getUTCDate() + 1);
  const today = now.toISOString().slice(0, 10);

  return { year, month, daysRemaining, today };
}

async function getActiveLeagueRank(userId: string): Promise<number> {
  const [participant] = await db
    .select({
      cohortId: leagueParticipants.cohortId,
      weeklyXp: leagueParticipants.weeklyXp,
      finalRank: leagueParticipants.finalRank,
    })
    .from(leagueParticipants)
    .innerJoin(leagueCohorts, eq(leagueParticipants.cohortId, leagueCohorts.id))
    .where(
      and(
        eq(leagueParticipants.userId, userId),
        eq(leagueCohorts.isProcessed, false),
      ),
    )
    .limit(1);

  if (!participant) return 0;
  if (participant.finalRank !== null) return participant.finalRank;

  const [higherResult] = await db
    .select({ higherCount: count() })
    .from(leagueParticipants)
    .where(
      and(
        eq(leagueParticipants.cohortId, participant.cohortId),
        gt(leagueParticipants.weeklyXp, participant.weeklyXp),
      ),
    );

  return (higherResult?.higherCount ?? 0) + 1;
}

export async function getUserStatsById(userId: string): Promise<UserStats> {
  if (!userId) return DEFAULT_USER_STATS;

  try {
    const [rows, leagueRank] = await Promise.all([
      db
        .select()
        .from(userGamification)
        .where(eq(userGamification.userId, userId))
        .limit(1),
      getActiveLeagueRank(userId),
    ]);

    const row = rows[0];
    if (!row) {
      return {
        ...DEFAULT_USER_STATS,
        leagueRank,
      };
    }

    return {
      xp: row.totalXp,
      level: row.level,
      streak: row.currentStreak,
      hearts: row.hearts,
      gems: row.gems,
      leagueNameKey: getLeagueNameKey(row.currentLeagueSlug),
      leagueRank,
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserStatsById] Error:', error);
    return DEFAULT_USER_STATS;
  }
}

export async function getCurrentUserStats(): Promise<UserStats> {
  try {
    const userId = await getSessionUserId();
    return await getUserStatsById(userId);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getCurrentUserStats] Error:', error);
    return DEFAULT_USER_STATS;
  }
}

function getDefaultDailyQuests(): Quest[] {
  return DEFAULT_DAILY_QUEST_TEMPLATES.map((template) => ({
    id: template.id,
    titleKey: template.titleKey,
    descriptionKey: template.descriptionKey,
    target: template.targetValue,
    current: 0,
    xpReward: template.xpReward,
    completed: false,
    iconType: template.iconType,
  }));
}

export async function getUserDailyQuestsById(userId: string): Promise<Quest[]> {
  if (!userId) return getDefaultDailyQuests();

  try {
    const { today } = getCurrentUtcDateInfo();

    let rows = await db
      .select()
      .from(userDailyQuests)
      .where(
        and(
          eq(userDailyQuests.userId, userId),
          eq(userDailyQuests.questDate, today),
        ),
      )
      .orderBy(asc(userDailyQuests.id));

    if (rows.length === 0) {
      await db
        .insert(userDailyQuests)
        .values(
          DEFAULT_DAILY_QUEST_TEMPLATES.map((template) => ({
            userId,
            questDate: today,
            questSlug: template.slug,
            currentValue: 0,
            targetValue: template.targetValue,
            xpReward: template.xpReward,
            gemsReward: template.gemsReward,
            isCompleted: false,
            isClaimed: false,
          })),
        )
        .onConflictDoNothing();

      rows = await db
        .select()
        .from(userDailyQuests)
        .where(
          and(
            eq(userDailyQuests.userId, userId),
            eq(userDailyQuests.questDate, today),
          ),
        )
        .orderBy(asc(userDailyQuests.id));
    }

    return rows.map((row) => {
      const template = QUEST_TEMPLATE_BY_SLUG.get(row.questSlug);
      return {
        id: row.id,
        titleKey: template?.titleKey ?? 'quests.earn_xp.title',
        descriptionKey:
          template?.descriptionKey ?? 'quests.earn_xp.description',
        target: row.targetValue,
        current: row.currentValue,
        xpReward: row.xpReward,
        completed: row.isCompleted,
        iconType: template?.iconType ?? 'xp',
      };
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserDailyQuestsById] Error:', error);
    return getDefaultDailyQuests();
  }
}

export async function getCurrentUserDailyQuests(): Promise<Quest[]> {
  try {
    const userId = await getSessionUserId();
    return await getUserDailyQuestsById(userId);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getCurrentUserDailyQuests] Error:', error);
    return getDefaultDailyQuests();
  }
}

export type ClaimDailyQuestRewardResult =
  | { ok: true; xpAwarded: number; gemsAwarded: number }
  | { ok: false; error: string };

async function incrementCurrentMonthBadgeProgress(userId: string) {
  const { year, month } = getCurrentUtcDateInfo();
  const badgeSlug = MONTHLY_BADGES[month - 1]?.id ?? 'pen';

  const [existing] = await db
    .select()
    .from(userMonthlyBadges)
    .where(
      and(
        eq(userMonthlyBadges.userId, userId),
        eq(userMonthlyBadges.year, year),
        eq(userMonthlyBadges.month, month),
      ),
    )
    .limit(1);

  if (!existing) {
    await db
      .insert(userMonthlyBadges)
      .values({
        userId,
        year,
        month,
        badgeSlug,
        currentProgress: 1,
        targetProgress: 20,
        isUnlocked: false,
      })
      .onConflictDoNothing();
    return;
  }

  const nextProgress = existing.currentProgress + 1;
  const isUnlocked = nextProgress >= existing.targetProgress;

  await db
    .update(userMonthlyBadges)
    .set({
      currentProgress: nextProgress,
      isUnlocked,
      unlockedAt: isUnlocked ? (existing.unlockedAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userMonthlyBadges.userId, userId),
        eq(userMonthlyBadges.year, year),
        eq(userMonthlyBadges.month, month),
      ),
    );
}

export async function claimDailyQuestReward(
  questId: number,
): Promise<ClaimDailyQuestRewardResult> {
  try {
    const userId = await getSessionUserId();
    if (!userId) return { ok: false, error: 'unauthorized' };

    const [claimed] = await db
      .update(userDailyQuests)
      .set({
        isClaimed: true,
        claimedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userDailyQuests.id, questId),
          eq(userDailyQuests.userId, userId),
          eq(userDailyQuests.isCompleted, true),
          eq(userDailyQuests.isClaimed, false),
        ),
      )
      .returning({
        questSlug: userDailyQuests.questSlug,
        xpReward: userDailyQuests.xpReward,
        gemsReward: userDailyQuests.gemsReward,
      });

    if (!claimed) {
      return { ok: false, error: 'quest_not_claimable' };
    }

    await db.insert(userXpLedger).values({
      userId,
      sourceType: 'quest',
      sourceRef: claimed.questSlug,
      xpAmount: claimed.xpReward,
    });

    await db
      .insert(userGamification)
      .values({
        userId,
        totalXp: claimed.xpReward,
        level: Math.max(1, Math.floor(claimed.xpReward / 100) + 1),
        gems: claimed.gemsReward,
      })
      .onConflictDoUpdate({
        target: userGamification.userId,
        set: {
          totalXp: sql`${userGamification.totalXp} + ${claimed.xpReward}`,
          level: sql`GREATEST(1, ((${userGamification.totalXp} + ${claimed.xpReward}) / 100) + 1)::smallint`,
          gems: sql`${userGamification.gems} + ${claimed.gemsReward}`,
          updatedAt: new Date(),
        },
      });

    await incrementCurrentMonthBadgeProgress(userId);

    const [activeParticipant] = await db
      .select({ cohortId: leagueParticipants.cohortId })
      .from(leagueParticipants)
      .innerJoin(
        leagueCohorts,
        eq(leagueParticipants.cohortId, leagueCohorts.id),
      )
      .where(
        and(
          eq(leagueParticipants.userId, userId),
          eq(leagueCohorts.isProcessed, false),
        ),
      )
      .limit(1);

    if (activeParticipant) {
      await db
        .update(leagueParticipants)
        .set({
          weeklyXp: sql`${leagueParticipants.weeklyXp} + ${claimed.xpReward}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(leagueParticipants.cohortId, activeParticipant.cohortId),
            eq(leagueParticipants.userId, userId),
          ),
        );
    }

    return {
      ok: true,
      xpAwarded: claimed.xpReward,
      gemsAwarded: claimed.gemsReward,
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[claimDailyQuestReward] Error:', error);
    return { ok: false, error: 'unknown' };
  }
}

export async function getUserMonthlyQuestById(
  userId: string,
): Promise<MonthlyQuest> {
  const { year, month, daysRemaining } = getCurrentUtcDateInfo();
  const theme = getMonthlyTheme(month);

  const fallback: MonthlyQuest = {
    month,
    titleKey: 'february_quest',
    target: 20,
    current: 0,
    daysRemaining,
    colorCode: theme.colorCode,
    emoji: theme.emoji,
    emojiColorCode: theme.emojiColorCode,
  };

  if (!userId) return fallback;

  try {
    const [row] = await db
      .select()
      .from(userMonthlyBadges)
      .where(
        and(
          eq(userMonthlyBadges.userId, userId),
          eq(userMonthlyBadges.year, year),
          eq(userMonthlyBadges.month, month),
        ),
      )
      .limit(1);

    return {
      ...fallback,
      target: row?.targetProgress ?? 20,
      current: row?.currentProgress ?? 0,
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserMonthlyQuestById] Error:', error);
    return fallback;
  }
}

export async function getCurrentUserMonthlyQuest(): Promise<MonthlyQuest> {
  try {
    const userId = await getSessionUserId();
    return await getUserMonthlyQuestById(userId);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getCurrentUserMonthlyQuest] Error:', error);
    return await getUserMonthlyQuestById('');
  }
}

export async function getUserMonthlyBadgesById(
  userId: string,
): Promise<MonthlyBadge[]> {
  if (!userId) return MONTHLY_BADGES;

  try {
    const rows = await db
      .select()
      .from(userMonthlyBadges)
      .where(eq(userMonthlyBadges.userId, userId))
      .orderBy(desc(userMonthlyBadges.year), desc(userMonthlyBadges.month));

    const badgeById = new Map(MONTHLY_BADGES.map((badge) => [badge.id, badge]));
    const orderedBadges: MonthlyBadge[] = [];
    const seenIds = new Set<string>();

    for (const row of rows) {
      const matched =
        badgeById.get(row.badgeSlug) ?? MONTHLY_BADGES[row.month - 1];
      if (matched && !seenIds.has(matched.id)) {
        orderedBadges.push(matched);
        seenIds.add(matched.id);
      }
    }

    for (const badge of MONTHLY_BADGES) {
      if (!seenIds.has(badge.id)) {
        orderedBadges.push(badge);
      }
    }

    return orderedBadges;
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserMonthlyBadgesById] Error:', error);
    return MONTHLY_BADGES;
  }
}

export async function getCurrentUserMonthlyBadges(): Promise<MonthlyBadge[]> {
  try {
    const userId = await getSessionUserId();
    return await getUserMonthlyBadgesById(userId);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getCurrentUserMonthlyBadges] Error:', error);
    return MONTHLY_BADGES;
  }
}

export async function getUserAchievementsById(
  userId: string,
): Promise<Achievement[]> {
  if (!userId) return ACHIEVEMENTS;

  try {
    const rows = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const levelMap = new Map(
      rows.map((row) => [row.achievementSlug, row.currentLevel]),
    );

    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      level: Math.max(1, levelMap.get(achievement.id) ?? 1),
    }));
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserAchievementsById] Error:', error);
    return ACHIEVEMENTS;
  }
}

export async function getUserProfileStatistics(
  userId: string,
  locale: string,
): Promise<Statistic[]> {
  try {
    const [gamificationRows, top3Rows, t] = await Promise.all([
      db
        .select()
        .from(userGamification)
        .where(eq(userGamification.userId, userId))
        .limit(1),
      db
        .select({ top3Count: count() })
        .from(leagueParticipants)
        .where(
          and(
            eq(leagueParticipants.userId, userId),
            lte(leagueParticipants.finalRank, 3),
          ),
        ),
      getTranslations({ locale, namespace: 'global' }),
    ]);

    const gamification = gamificationRows[0];
    const leagueNameKey = getLeagueNameKey(gamification?.currentLeagueSlug);

    return [
      {
        id: 'streak',
        labelKey: 'day_streak',
        value: gamification?.currentStreak ?? 0,
        icon: 'flame',
      },
      {
        id: 'xp',
        labelKey: 'total_xp',
        value: gamification?.totalXp ?? 0,
        icon: 'zap',
      },
      {
        id: 'league',
        labelKey: 'current_league',
        value: t(leagueNameKey),
        icon: 'shield',
      },
      {
        id: 'top3',
        labelKey: 'top_3_finishes',
        value: top3Rows[0]?.top3Count ?? 0,
        icon: 'trophy',
      },
    ];
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserProfileStatistics] Error:', error);
    return [];
  }
}

export async function getUserXpHistory(
  userId: string,
  limit = 20,
): Promise<XpLedgerEntry[]> {
  if (!userId) return [];

  try {
    return await db
      .select()
      .from(userXpLedger)
      .where(eq(userXpLedger.userId, userId))
      .orderBy(desc(userXpLedger.createdAt))
      .limit(limit);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserXpHistory] Error:', error);
    return [];
  }
}
