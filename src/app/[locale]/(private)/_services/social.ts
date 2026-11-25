'use server';

import { and, asc, count, desc, eq, gte, inArray, ne, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { safeParse } from 'valibot';

import {
  leagueCohorts,
  leagueParticipants,
  userGamification,
  userMonthlyBadges,
  userXpLedger,
} from '@/db/gamification-schema';
import { userFollows, userProfiles } from '@/db/user-schema';
import type { LeaderboardEntry } from '@/features/gamification/schemas/gamification';
import type { FriendSuggestion } from '@/features/user-profile/schemas/user-profile';
import { auth } from '@/lib/auth';
import {
  AVATAR_GRADIENT_CODES,
  AVATAR_SOLID_CODES,
  type AvatarColorCode,
} from '@/lib/avatar';
import { db } from '@/lib/db';

import type { ActivityFeedItem, FollowEntry } from '../_schemas/private';
import {
  type ToggleFollowInput,
  ToggleFollowInputSchema,
  type ToggleFollowResult,
} from '../_schemas/social';

const VALID_AVATAR_COLORS = new Set<string>([
  ...AVATAR_SOLID_CODES,
  ...AVATAR_GRADIENT_CODES,
]);

const VALID_DB_LEAGUE_SLUGS = new Set([
  'peace',
  'devotion',
  'knowledge',
  'sincerity',
  'humility',
  'patience',
  'gratitude',
  'righteousness',
  'wisdom',
  'paradise',
]);

function toAvatarColorCode(
  code: string | null | undefined,
): AvatarColorCode | undefined {
  if (!code || !VALID_AVATAR_COLORS.has(code)) return undefined;
  return code as AvatarColorCode;
}

function getCurrentUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentUtcWeekStart(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + diffToMonday,
    ),
  );
}

function getCurrentUtcWeekStartDate(): string {
  return getCurrentUtcWeekStart().toISOString().slice(0, 10);
}

function normalizeDbLeagueSlug(slug: string | null | undefined): string {
  if (!slug || !VALID_DB_LEAGUE_SLUGS.has(slug)) return 'peace';
  return slug;
}

async function getSessionUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? '';
}

export async function ensureUserActiveLeagueCohort(userId: string): Promise<{
  cohortId: number;
  leagueSlug: string;
}> {
  const [existing] = await db
    .select({
      cohortId: leagueCohorts.id,
      leagueSlug: leagueCohorts.leagueSlug,
    })
    .from(leagueParticipants)
    .innerJoin(leagueCohorts, eq(leagueParticipants.cohortId, leagueCohorts.id))
    .where(
      and(
        eq(leagueParticipants.userId, userId),
        eq(leagueCohorts.isProcessed, false),
      ),
    )
    .orderBy(desc(leagueCohorts.weekStartDate))
    .limit(1);

  if (existing) {
    return existing;
  }

  const weekStart = getCurrentUtcWeekStart();
  const weekStartDate = getCurrentUtcWeekStartDate();

  const [gamificationRows, weeklyXpRows] = await Promise.all([
    db
      .select({ currentLeagueSlug: userGamification.currentLeagueSlug })
      .from(userGamification)
      .where(eq(userGamification.userId, userId))
      .limit(1),
    db
      .select({
        total: sql<number>`COALESCE(SUM(${userXpLedger.xpAmount}), 0)::int`,
      })
      .from(userXpLedger)
      .where(
        and(
          eq(userXpLedger.userId, userId),
          gte(userXpLedger.createdAt, weekStart),
        ),
      ),
  ]);

  const leagueSlug = normalizeDbLeagueSlug(
    gamificationRows[0]?.currentLeagueSlug,
  );
  const weeklyXp = Math.max(0, weeklyXpRows[0]?.total ?? 0);

  let [cohort] = await db
    .select({ id: leagueCohorts.id, leagueSlug: leagueCohorts.leagueSlug })
    .from(leagueCohorts)
    .where(
      and(
        eq(leagueCohorts.leagueSlug, leagueSlug),
        eq(leagueCohorts.weekStartDate, weekStartDate),
        eq(leagueCohorts.isProcessed, false),
      ),
    )
    .orderBy(asc(leagueCohorts.id))
    .limit(1);

  if (!cohort) {
    const [inserted] = await db
      .insert(leagueCohorts)
      .values({
        leagueSlug,
        weekStartDate,
        isProcessed: false,
      })
      .returning({
        id: leagueCohorts.id,
        leagueSlug: leagueCohorts.leagueSlug,
      });
    cohort = inserted;
  }

  await db
    .insert(leagueParticipants)
    .values({
      cohortId: cohort.id,
      userId,
      weeklyXp,
    })
    .onConflictDoNothing();

  return { cohortId: cohort.id, leagueSlug: cohort.leagueSlug };
}

export async function getWeeklyLeaderboard(
  limit = 30,
): Promise<LeaderboardEntry[]> {
  try {
    const userId = await getSessionUserId();

    let cohortId: number | undefined;
    if (userId) {
      const ensured = await ensureUserActiveLeagueCohort(userId);
      cohortId = ensured.cohortId;
    } else {
      const [latestCohort] = await db
        .select({ id: leagueCohorts.id })
        .from(leagueCohorts)
        .where(eq(leagueCohorts.isProcessed, false))
        .orderBy(desc(leagueCohorts.weekStartDate), asc(leagueCohorts.id))
        .limit(1);
      cohortId = latestCohort?.id;
    }

    if (cohortId) {
      const rows = await db
        .select({
          userId: leagueParticipants.userId,
          weeklyXp: leagueParticipants.weeklyXp,
          finalRank: leagueParticipants.finalRank,
          displayName: userProfiles.displayName,
          avatarColorCode: userProfiles.avatarColorCode,
        })
        .from(leagueParticipants)
        .innerJoin(userProfiles, eq(leagueParticipants.userId, userProfiles.id))
        .where(eq(leagueParticipants.cohortId, cohortId))
        .orderBy(
          desc(leagueParticipants.weeklyXp),
          asc(userProfiles.displayName),
        )
        .limit(limit);

      if (rows.length > 0) {
        return rows.map((row, index) => ({
          rank: row.finalRank ?? index + 1,
          userId: row.userId,
          name: row.displayName,
          xp: row.weeklyXp,
          avatarColorCode: toAvatarColorCode(row.avatarColorCode),
          isCurrentUser: row.userId === userId,
        }));
      }
    }

    if (!userId) return [];

    const [profile] = await db
      .select({
        id: userProfiles.id,
        displayName: userProfiles.displayName,
        avatarColorCode: userProfiles.avatarColorCode,
      })
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1);

    if (!profile) return [];

    return [
      {
        rank: 1,
        userId: profile.id,
        name: profile.displayName,
        xp: 0,
        avatarColorCode: toAvatarColorCode(profile.avatarColorCode),
        isCurrentUser: true,
      },
    ];
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getWeeklyLeaderboard] Error:', error);
    return [];
  }
}

export async function getCurrentUserLeaderboardPreview(): Promise<
  LeaderboardEntry[]
> {
  const entries = await getWeeklyLeaderboard(30);
  if (entries.length <= 4) return entries;

  const topThree = entries.slice(0, 3);
  const currentUserEntry = entries.find((entry) => entry.isCurrentUser);

  if (!currentUserEntry) {
    return topThree;
  }

  if (currentUserEntry.rank <= 3) {
    return entries.slice(0, 4);
  }

  return [...topThree, currentUserEntry];
}

export async function getUserFollowing(
  userId: string,
  limit = 5,
): Promise<FollowEntry[]> {
  if (!userId) return [];

  try {
    const today = getCurrentUtcDateString();
    const rows = await db
      .select({
        id: userProfiles.id,
        displayName: userProfiles.displayName,
        avatarColorCode: userProfiles.avatarColorCode,
        totalXp: userGamification.totalXp,
        lastActiveDate: userGamification.lastActiveDate,
      })
      .from(userFollows)
      .innerJoin(userProfiles, eq(userFollows.followingId, userProfiles.id))
      .leftJoin(userGamification, eq(userProfiles.id, userGamification.userId))
      .where(eq(userFollows.followerId, userId))
      .orderBy(desc(userFollows.createdAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      name: row.displayName,
      avatarColorCode: toAvatarColorCode(row.avatarColorCode),
      xp: row.totalXp ?? 0,
      isOnline: row.lastActiveDate === today,
    }));
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserFollowing] Error:', error);
    return [];
  }
}

export async function getUserFollowers(
  userId: string,
  limit = 5,
): Promise<FollowEntry[]> {
  if (!userId) return [];

  try {
    const today = getCurrentUtcDateString();
    const rows = await db
      .select({
        id: userProfiles.id,
        displayName: userProfiles.displayName,
        avatarColorCode: userProfiles.avatarColorCode,
        totalXp: userGamification.totalXp,
        lastActiveDate: userGamification.lastActiveDate,
      })
      .from(userFollows)
      .innerJoin(userProfiles, eq(userFollows.followerId, userProfiles.id))
      .leftJoin(userGamification, eq(userProfiles.id, userGamification.userId))
      .where(eq(userFollows.followingId, userId))
      .orderBy(desc(userFollows.createdAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      name: row.displayName,
      avatarColorCode: toAvatarColorCode(row.avatarColorCode),
      xp: row.totalXp ?? 0,
      isOnline: row.lastActiveDate === today,
    }));
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserFollowers] Error:', error);
    return [];
  }
}

export async function getFriendSuggestions(
  profileUserId?: string,
  limit = 6,
): Promise<FriendSuggestion[]> {
  try {
    const sessionUserId = await getSessionUserId();
    const viewerId =
      sessionUserId.length > 0 ? sessionUserId : (profileUserId ?? '');

    const candidateQuery = db
      .select({
        id: userProfiles.id,
        username: userProfiles.username,
        displayName: userProfiles.displayName,
        avatarColorCode: userProfiles.avatarColorCode,
      })
      .from(userProfiles);

    const candidates = viewerId
      ? await candidateQuery
          .where(ne(userProfiles.id, viewerId))
          .orderBy(
            desc(userProfiles.followersCount),
            desc(userProfiles.createdAt),
          )
          .limit(limit)
      : await candidateQuery
          .orderBy(
            desc(userProfiles.followersCount),
            desc(userProfiles.createdAt),
          )
          .limit(limit);

    if (candidates.length === 0) return [];

    if (!viewerId) {
      return candidates.map((candidate) => ({
        id: candidate.id,
        username: candidate.username,
        displayName: candidate.displayName,
        avatarColorCode: toAvatarColorCode(candidate.avatarColorCode),
        mutualFriendsCount: 0,
        isFollowing: false,
      }));
    }

    const viewerFollowingRows = await db
      .select({ followingId: userFollows.followingId })
      .from(userFollows)
      .where(eq(userFollows.followerId, viewerId));

    const viewerFollowingIds = viewerFollowingRows.map((r) => r.followingId);
    const viewerFollowingSet = new Set(viewerFollowingIds);
    const candidateIds = candidates.map((c) => c.id);

    const mutualCountMap = new Map<string, number>();
    if (viewerFollowingIds.length > 0 && candidateIds.length > 0) {
      const mutualRows = await db
        .select({
          followingId: userFollows.followingId,
          mutualCount: count(),
        })
        .from(userFollows)
        .where(
          and(
            inArray(userFollows.followerId, viewerFollowingIds),
            inArray(userFollows.followingId, candidateIds),
          ),
        )
        .groupBy(userFollows.followingId);

      for (const row of mutualRows) {
        mutualCountMap.set(row.followingId, row.mutualCount);
      }
    }

    return candidates.map((candidate) => ({
      id: candidate.id,
      username: candidate.username,
      displayName: candidate.displayName,
      avatarColorCode: toAvatarColorCode(candidate.avatarColorCode),
      mutualFriendsCount: mutualCountMap.get(candidate.id) ?? 0,
      isFollowing: viewerFollowingSet.has(candidate.id),
    }));
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getFriendSuggestions] Error:', error);
    return [];
  }
}

export async function toggleFollowUser(
  input: ToggleFollowInput,
): Promise<ToggleFollowResult> {
  const parsed = safeParse(ToggleFollowInputSchema, input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid_input' };
  }

  try {
    const userId = await getSessionUserId();
    if (!userId) return { ok: false, error: 'unauthorized' };

    const { targetUserId } = parsed.output;
    if (userId === targetUserId) {
      return { ok: false, error: 'cannot_follow_self' };
    }

    const [existing] = await db
      .select({ followerId: userFollows.followerId })
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerId, userId),
          eq(userFollows.followingId, targetUserId),
        ),
      )
      .limit(1);

    let isFollowing: boolean;
    if (existing) {
      await db
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerId, userId),
            eq(userFollows.followingId, targetUserId),
          ),
        );
      isFollowing = false;
    } else {
      await db
        .insert(userFollows)
        .values({ followerId: userId, followingId: targetUserId })
        .onConflictDoNothing();
      isFollowing = true;
    }

    await Promise.all([
      db
        .update(userProfiles)
        .set({
          followingCount: sql`(SELECT count(*)::int FROM user_follows WHERE follower_id = ${userId})`,
        })
        .where(eq(userProfiles.id, userId)),
      db
        .update(userProfiles)
        .set({
          followersCount: sql`(SELECT count(*)::int FROM user_follows WHERE following_id = ${targetUserId})`,
        })
        .where(eq(userProfiles.id, targetUserId)),
    ]);

    return { ok: true, isFollowing };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[toggleFollowUser] Error:', error);
    return { ok: false, error: 'unknown' };
  }
}

export async function getUserActivityFeed(
  userId: string,
  limit = 5,
): Promise<ActivityFeedItem[]> {
  if (!userId) return [];

  try {
    const followingRows = await db
      .select({ followingId: userFollows.followingId })
      .from(userFollows)
      .where(eq(userFollows.followerId, userId));

    const targetIds = Array.from(
      new Set([userId, ...followingRows.map((r) => r.followingId)]),
    );

    const [streakRows, badgeRows] = await Promise.all([
      db
        .select({
          userId: userGamification.userId,
          displayName: userProfiles.displayName,
          avatarColorCode: userProfiles.avatarColorCode,
          currentStreak: userGamification.currentStreak,
          updatedAt: userGamification.updatedAt,
        })
        .from(userGamification)
        .innerJoin(userProfiles, eq(userGamification.userId, userProfiles.id))
        .where(
          and(
            inArray(userGamification.userId, targetIds),
            sql`${userGamification.currentStreak} > 0`,
          ),
        )
        .orderBy(desc(userGamification.updatedAt))
        .limit(limit),
      db
        .select({
          userId: userMonthlyBadges.userId,
          year: userMonthlyBadges.year,
          month: userMonthlyBadges.month,
          displayName: userProfiles.displayName,
          avatarColorCode: userProfiles.avatarColorCode,
          unlockedAt: userMonthlyBadges.unlockedAt,
          updatedAt: userMonthlyBadges.updatedAt,
        })
        .from(userMonthlyBadges)
        .innerJoin(userProfiles, eq(userMonthlyBadges.userId, userProfiles.id))
        .where(
          and(
            inArray(userMonthlyBadges.userId, targetIds),
            eq(userMonthlyBadges.isUnlocked, true),
          ),
        )
        .orderBy(
          desc(userMonthlyBadges.unlockedAt),
          desc(userMonthlyBadges.updatedAt),
        )
        .limit(limit),
    ]);

    const feed: ActivityFeedItem[] = [
      ...streakRows.map((row) => ({
        id: `streak-${row.userId}-${row.currentStreak}`,
        userName: row.displayName,
        avatarColorCode: toAvatarColorCode(row.avatarColorCode),
        activityDate: row.updatedAt.toISOString(),
        descriptionKey: 'activity.completed_streak',
        reactionEmojis: ['🔥'],
        reactionCount: row.currentStreak,
      })),
      ...badgeRows.map((row) => ({
        id: `badge-${row.userId}-${row.year}-${row.month}`,
        userName: row.displayName,
        avatarColorCode: toAvatarColorCode(row.avatarColorCode),
        activityDate: (row.unlockedAt ?? row.updatedAt).toISOString(),
        descriptionKey: 'activity.collected_badge',
        reactionEmojis: ['🎉'],
        reactionCount: 1,
      })),
    ];

    feed.sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime(),
    );

    return feed.slice(0, limit);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUserActivityFeed] Error:', error);
    return [];
  }
}
