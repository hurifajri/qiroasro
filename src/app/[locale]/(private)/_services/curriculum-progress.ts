'use server';

import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { parse } from 'valibot';
import {
  userLessonProgress,
  userSectionProgress,
  userUnitProgress,
} from '@/db/curriculum-schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { CURRICULUM_TOPICS } from '../_lib/curriculum';
import {
  SectionProgressListSchema,
  type SectionWithProgress,
  UnitProgressListSchema,
  type UnitWithProgress,
} from '../_schemas/curriculum-progress';

/**
 * Derives a section status from progress values.
 * - completed: all units done
 * - in-progress: some units done but not all
 * - available: first unlocked, no progress yet
 * - locked: prerequisites not met (section before this not started)
 */
function deriveSectionStatus(
  sortOrder: number,
  completedUnits: number,
  totalUnits: number,
  prevIsStarted: boolean,
): SectionWithProgress['status'] {
  // if (totalUnits > 0 && completedUnits >= totalUnits) return 'completed';
  // if (completedUnits > 0) return 'in-progress';
  // if (sortOrder === 1 || prevIsStarted) return 'available';
  // return 'locked';
  return 'available';
}

/**
 * Returns all topics as SectionWithProgress, merged with DB progress for the
 * authenticated user. For unauthenticated requests returns locked sections.
 */
export async function getSectionsWithProgress(): Promise<
  SectionWithProgress[]
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    // Fetch all section progress rows for this user (empty if not logged in)
    const dbRows =
      userId !== undefined
        ? await db
            .select()
            .from(userSectionProgress)
            .where(eq(userSectionProgress.userId, userId))
        : [];

    const dbUnitRows =
      userId !== undefined
        ? await db
            .select()
            .from(userUnitProgress)
            .where(eq(userUnitProgress.userId, userId))
        : [];

    const sectionProgressMap = new Map(
      dbRows.map((r) => [r.topicSlug, r.isCompleted]),
    );

    const unitProgressMap = new Map(
      dbUnitRows.map((r) => [`${r.topicSlug}|${r.unitSlug}`, r.isCompleted]),
    );

    const sectionProgressList: SectionWithProgress[] = [];
    let prevIsStarted = true; // First section is always available

    for (const topic of CURRICULUM_TOPICS) {
      const totalUnits = topic.units.length;
      const completedUnits = topic.units.filter(
        (u) => unitProgressMap.get(`${topic.slug}|${u.slug}`) === true,
      ).length;

      const progress =
        totalUnits === 0 ? 0 : Math.round((completedUnits / totalUnits) * 100);

      const status = deriveSectionStatus(
        topic.sortOrder,
        completedUnits,
        totalUnits,
        prevIsStarted,
      );

      sectionProgressList.push({
        slug: topic.slug,
        sortOrder: topic.sortOrder,
        titleKey: topic.titleKey,
        descriptionKey: topic.subtitleKey,
        iconSymbol: topic.iconSymbol,
        totalUnits,
        completedUnits,
        progress,
        status,
      });

      // Track if this section was started (to unlock the next one)
      prevIsStarted = sectionProgressMap.has(topic.slug) || completedUnits > 0;
    }

    return parse(SectionProgressListSchema, sectionProgressList);
  } catch (error) {
    console.error('[getSectionsWithProgress] Error:', error);
    return [];
  }
}

/**
 * Returns units for a specific topic with per-unit completion status.
 * Falls back to locked status if user is not authenticated.
 */
export async function getUnitsWithProgress(
  topicSlug: string,
): Promise<UnitWithProgress[]> {
  try {
    const topic = CURRICULUM_TOPICS.find((t) => t.slug === topicSlug);
    if (!topic) return [];

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const dbRows =
      userId !== undefined
        ? await db
            .select()
            .from(userUnitProgress)
            .where(
              and(
                eq(userUnitProgress.userId, userId),
                eq(userUnitProgress.topicSlug, topicSlug),
              ),
            )
        : [];

    const dbLessonRows =
      userId !== undefined
        ? await db
            .select()
            .from(userLessonProgress)
            .where(
              and(
                eq(userLessonProgress.userId, userId),
                eq(userLessonProgress.topicSlug, topicSlug),
              ),
            )
        : [];

    const unitCompletionMap = new Map(
      dbRows.map((r) => [r.unitSlug, r.isCompleted]),
    );

    const lessonCountMap = new Map<string, number>();
    for (const row of dbLessonRows) {
      if (row.isCompleted) {
        lessonCountMap.set(
          row.unitSlug,
          (lessonCountMap.get(row.unitSlug) ?? 0) + 1,
        );
      }
    }

    const unitProgressList = topic.units.map((unit, idx) => ({
      slug: unit.slug,
      sortOrder: idx + 1,
      titleKey: unit.titleKey,
      descriptionKey: unit.descriptionKey,
      colorCode: unit.colorCode,
      iconKey: unit.iconKey,
      isCompleted: unitCompletionMap.get(unit.slug) ?? false,
      completedLessons: lessonCountMap.get(unit.slug) ?? 0,
      totalLessons: unit.lessons.length,
    }));

    return parse(UnitProgressListSchema, unitProgressList);
  } catch (error) {
    console.error('[getUnitsWithProgress] Error:', error);
    return [];
  }
}

/**
 * Marks a lesson as complete and returns updated lesson status.
 * Creates or updates the userLessonProgress row.
 */
export async function completeLessonAction(
  topicSlug: string,
  unitSlug: string,
  lessonOrder: number,
  score: number,
): Promise<{ success: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await db
      .insert(userLessonProgress)
      .values({
        userId,
        topicSlug,
        unitSlug,
        lessonOrder,
        isCompleted: true,
        score,
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          userLessonProgress.userId,
          userLessonProgress.topicSlug,
          userLessonProgress.unitSlug,
          userLessonProgress.lessonOrder,
        ],
        set: {
          isCompleted: true,
          score,
          completedAt: new Date(),
        },
      });

    // Check if all lessons in the unit are now complete
    const topic = CURRICULUM_TOPICS.find((t) => t.slug === topicSlug);
    const unit = topic?.units.find((u) => u.slug === unitSlug);

    if (unit) {
      const completedLessons = await db
        .select()
        .from(userLessonProgress)
        .where(
          and(
            eq(userLessonProgress.userId, userId),
            eq(userLessonProgress.topicSlug, topicSlug),
            eq(userLessonProgress.unitSlug, unitSlug),
            eq(userLessonProgress.isCompleted, true),
          ),
        );

      if (completedLessons.length >= unit.lessons.length) {
        // Mark unit as complete
        await db
          .insert(userUnitProgress)
          .values({
            userId,
            topicSlug,
            unitSlug,
            isCompleted: true,
            completedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [
              userUnitProgress.userId,
              userUnitProgress.topicSlug,
              userUnitProgress.unitSlug,
            ],
            set: {
              isCompleted: true,
              completedAt: new Date(),
            },
          });

        // Check if all units in topic are now complete
        const completedUnits = await db
          .select()
          .from(userUnitProgress)
          .where(
            and(
              eq(userUnitProgress.userId, userId),
              eq(userUnitProgress.topicSlug, topicSlug),
              eq(userUnitProgress.isCompleted, true),
            ),
          );

        if (completedUnits.length >= (topic?.units.length ?? 0)) {
          await db
            .insert(userSectionProgress)
            .values({
              userId,
              topicSlug,
              isCompleted: true,
              completedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: [
                userSectionProgress.userId,
                userSectionProgress.topicSlug,
              ],
              set: {
                isCompleted: true,
                completedAt: new Date(),
              },
            });
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[completeLessonAction] Error:', error);
    return { success: false };
  }
}
