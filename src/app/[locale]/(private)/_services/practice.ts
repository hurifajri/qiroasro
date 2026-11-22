'use server';

import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { safeParse } from 'valibot';

import { userMistakeItems, userSavedItems } from '@/db/curriculum-schema';
import {
  hijArticulationPoints,
  hijLetterArticulations,
  hijLetters,
  hijTraits,
} from '@/db/hijaiyyah-schema';
import {
  curQuestions,
  refSources,
  refVerses,
  tajExamples,
  tajRules,
} from '@/db/tajwid-schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

import { getAuthoredQuiz } from '../_lib/quiz-content';
import {
  type AdaptivePracticeItem,
  type CurQuestionData,
  CurQuestionDataSchema,
  type PracticeSection,
  type PracticeTargetType,
  type QuizSessionChoice,
  type QuizSessionQuestion,
  type RecordPracticeAttemptInput,
  RecordPracticeAttemptInputSchema,
  type ToggleSavedItemInput,
  ToggleSavedItemInputSchema,
} from '../_schemas/practice';

interface AdaptiveCandidate {
  targetType: PracticeTargetType;
  targetSlug: string;
  priorityReason: string;
  mistakeCount: number;
}

const MODE_TO_TARGET_TYPE: Record<string, PracticeTargetType> = {
  articulation: 'point',
  trait: 'trait',
  rule: 'rule',
  listen: 'example',
};

function formatSlugTitle(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function getSessionUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? '';
}

export async function getPracticeSections(): Promise<PracticeSection[]> {
  let mistakesCount = 0;
  let savedCount = 0;
  let listenCount = 0;

  try {
    const userId = await getSessionUserId();

    const [examplesCountRows, mistakeRows, savedRows] = await Promise.all([
      db.select({ value: count() }).from(tajExamples),
      userId
        ? db
            .select({ value: count() })
            .from(userMistakeItems)
            .where(
              and(
                eq(userMistakeItems.userId, userId),
                eq(userMistakeItems.isResolved, false),
              ),
            )
        : Promise.resolve([{ value: 0 }]),
      userId
        ? db
            .select({ value: count() })
            .from(userSavedItems)
            .where(eq(userSavedItems.userId, userId))
        : Promise.resolve([{ value: 0 }]),
    ]);

    listenCount = examplesCountRows[0]?.value ?? 0;
    mistakesCount = mistakeRows[0]?.value ?? 0;
    savedCount = savedRows[0]?.value ?? 0;
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getPracticeSections] Error:', error);
  }

  return [
    {
      id: 'letters',
      titleKey: 'sections.letters',
      modes: [
        {
          id: 'articulation',
          titleKey: 'modes.articulation.title',
          descriptionKey: 'modes.articulation.description',
          iconName: 'Speech',
          href: '/practice/articulation',
          colorCode: 'orange',
          targetType: 'point',
        },
        {
          id: 'trait',
          titleKey: 'modes.trait.title',
          descriptionKey: 'modes.trait.description',
          iconName: 'Zap',
          href: '/practice/trait',
          colorCode: 'amber',
          targetType: 'trait',
        },
      ],
    },
    {
      id: 'rules',
      titleKey: 'sections.rules',
      modes: [
        {
          id: 'rule',
          titleKey: 'modes.rule.title',
          descriptionKey: 'modes.rule.description',
          iconName: 'BookOpen',
          href: '/practice/rule',
          colorCode: 'emerald',
          targetType: 'rule',
        },
        {
          id: 'listen',
          titleKey: 'modes.listen.title',
          descriptionKey: 'modes.listen.description',
          iconName: 'Headphones',
          href: '/practice/listen',
          badge: listenCount > 0 ? listenCount : undefined,
          colorCode: 'sky',
          targetType: 'example',
        },
      ],
    },
    {
      id: 'collections',
      titleKey: 'sections.collections',
      modes: [
        {
          id: 'mistakes',
          titleKey: 'modes.mistakes.title',
          descriptionKey: 'modes.mistakes.description',
          iconName: 'RefreshCw',
          href: '/practice/mistakes',
          badge: mistakesCount > 0 ? mistakesCount : undefined,
          colorCode: 'amber',
          isPremium: true,
          targetType: 'question',
        },
        {
          id: 'saved',
          titleKey: 'modes.saved.title',
          descriptionKey: 'modes.saved.description',
          iconName: 'Star',
          href: '/practice/saved',
          badge: savedCount > 0 ? savedCount : undefined,
          colorCode: 'purple',
          targetType: 'question',
        },
      ],
    },
  ];
}

function extractAdaptiveRows(rawResult: unknown): AdaptiveCandidate[] {
  if (!Array.isArray(rawResult)) return [];

  const parsed: AdaptiveCandidate[] = [];
  for (const row of rawResult) {
    if (!row || typeof row !== 'object') continue;
    const record = row as Record<string, unknown>;
    const targetType = record.target_type;
    const targetSlug = record.target_slug;
    if (typeof targetType !== 'string' || typeof targetSlug !== 'string') {
      continue;
    }

    parsed.push({
      targetType: targetType as PracticeTargetType,
      targetSlug,
      priorityReason:
        typeof record.priority_reason === 'string'
          ? record.priority_reason
          : 'fresh_curriculum',
      mistakeCount:
        typeof record.mistake_count === 'number' ? record.mistake_count : 0,
    });
  }

  return parsed;
}

async function fetchFallbackCandidates(
  targetType: PracticeTargetType,
  limit: number,
): Promise<AdaptiveCandidate[]> {
  if (targetType === 'point') {
    const rows = await db
      .select({ slug: hijArticulationPoints.slug })
      .from(hijArticulationPoints)
      .orderBy(asc(hijArticulationPoints.sortOrder))
      .limit(limit);
    return rows.map((r) => ({
      targetType,
      targetSlug: r.slug,
      priorityReason: 'fresh_curriculum',
      mistakeCount: 0,
    }));
  }

  if (targetType === 'trait') {
    const rows = await db
      .select({ slug: hijTraits.slug })
      .from(hijTraits)
      .orderBy(asc(hijTraits.sortOrder))
      .limit(limit);
    return rows.map((r) => ({
      targetType,
      targetSlug: r.slug,
      priorityReason: 'fresh_curriculum',
      mistakeCount: 0,
    }));
  }

  if (targetType === 'rule') {
    const rows = await db
      .select({ slug: tajRules.slug })
      .from(tajRules)
      .orderBy(asc(tajRules.sortOrder))
      .limit(limit);
    return rows.map((r) => ({
      targetType,
      targetSlug: r.slug,
      priorityReason: 'fresh_curriculum',
      mistakeCount: 0,
    }));
  }

  const rows = await db
    .select({ slug: tajExamples.slug })
    .from(tajExamples)
    .orderBy(asc(tajExamples.sortOrder))
    .limit(limit);
  return rows.map((r) => ({
    targetType: 'example',
    targetSlug: r.slug,
    priorityReason: 'fresh_curriculum',
    mistakeCount: 0,
  }));
}

interface PracticeEnrichmentEntry {
  subtitle: string;
  arabicText?: string;
}

async function enrichPracticeItems(
  candidates: readonly AdaptiveCandidate[],
  savedKeys: ReadonlySet<string>,
): Promise<AdaptivePracticeItem[]> {
  if (candidates.length === 0) return [];

  const [letters, points, traits, rules, examples, questions, sources, verses] =
    await Promise.all([
      db.select().from(hijLetters),
      db.select().from(hijArticulationPoints),
      db.select().from(hijTraits),
      db.select().from(tajRules),
      db.select().from(tajExamples),
      db.select().from(curQuestions),
      db.select().from(refSources),
      db.select().from(refVerses),
    ]);

  const sourceSlugById = new Map(sources.map((s) => [s.id, s.slug]));
  const metadataByKey = new Map<string, PracticeEnrichmentEntry>();

  for (const l of letters) {
    metadataByKey.set(`letter:${l.slug}`, {
      subtitle: l.tafkhimType,
      arabicText: l.symbol,
    });
  }
  for (const p of points) {
    metadataByKey.set(`point:${p.slug}`, {
      subtitle: `Makhraj #${p.sortOrder}`,
    });
  }
  for (const t of traits) {
    metadataByKey.set(`trait:${t.slug}`, {
      subtitle: `Sifat #${t.sortOrder}`,
    });
  }
  for (const r of rules) {
    metadataByKey.set(`rule:${r.slug}`, {
      subtitle: formatSlugTitle(r.category),
    });
  }
  for (const e of examples) {
    metadataByKey.set(`example:${e.slug}`, {
      subtitle: `Surah ${e.surahNumber}:${e.ayahNumber}`,
      arabicText: e.arabicText,
    });
  }
  for (const v of verses) {
    const slug = `${sourceSlugById.get(v.sourceId) ?? 'source'}-${v.verseNumber}`;
    metadataByKey.set(`verse:${slug}`, {
      subtitle: `Verse ${v.verseNumber}`,
      arabicText: v.arabicText,
    });
  }
  for (const q of questions) {
    metadataByKey.set(`question:${q.slug}`, {
      subtitle: `${formatSlugTitle(q.topicSlug)} • ${formatSlugTitle(q.unitSlug)}`,
    });
  }

  return candidates.map((candidate) => {
    const key = `${candidate.targetType}:${candidate.targetSlug}`;
    const meta = metadataByKey.get(key);
    return {
      ...candidate,
      title: formatSlugTitle(candidate.targetSlug),
      subtitle: meta?.subtitle ?? formatSlugTitle(candidate.targetType),
      arabicText: meta?.arabicText,
      isSaved: savedKeys.has(key),
    };
  });
}

export async function getAdaptivePracticeItems(
  modeId: string,
  limit = 10,
): Promise<AdaptivePracticeItem[]> {
  try {
    const userId = await getSessionUserId();
    const savedRows = userId
      ? await db
          .select()
          .from(userSavedItems)
          .where(eq(userSavedItems.userId, userId))
          .orderBy(desc(userSavedItems.createdAt))
      : [];

    const savedKeys = new Set(
      savedRows.map((row) => `${row.targetType}:${row.targetSlug}`),
    );

    if (modeId === 'mistakes') {
      if (!userId) return [];
      const mistakeRows = await db
        .select()
        .from(userMistakeItems)
        .where(
          and(
            eq(userMistakeItems.userId, userId),
            eq(userMistakeItems.isResolved, false),
          ),
        )
        .orderBy(asc(userMistakeItems.nextReviewAt))
        .limit(limit);

      return await enrichPracticeItems(
        mistakeRows.map((r) => ({
          targetType: r.targetType,
          targetSlug: r.targetSlug,
          priorityReason: 'srs_due_mistake',
          mistakeCount: r.mistakeCount,
        })),
        savedKeys,
      );
    }

    if (modeId === 'saved') {
      return await enrichPracticeItems(
        savedRows.slice(0, limit).map((r) => ({
          targetType: r.targetType,
          targetSlug: r.targetSlug,
          priorityReason: 'saved_bookmark',
          mistakeCount: 0,
        })),
        savedKeys,
      );
    }

    const targetType = MODE_TO_TARGET_TYPE[modeId] ?? 'point';
    let candidates: AdaptiveCandidate[] = [];

    if (userId) {
      try {
        const result = await db.execute(
          sql`SELECT * FROM fn_get_adaptive_practice_items(${userId}, ${targetType}::practice_target_type, ${limit})`,
        );
        candidates = extractAdaptiveRows(result);
      } catch (fnError) {
        console.warn(
          '[getAdaptivePracticeItems] fn_get_adaptive_practice_items fallback:',
          fnError,
        );
      }
    }

    if (candidates.length === 0) {
      candidates = await fetchFallbackCandidates(targetType, limit);
    }

    return await enrichPracticeItems(candidates, savedKeys);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getAdaptivePracticeItems] Error:', error);
    return [];
  }
}

async function recordMistakeFallback(
  userId: string,
  targetType: PracticeTargetType,
  targetSlug: string,
) {
  const nextReview = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db
    .insert(userMistakeItems)
    .values({
      userId,
      targetType,
      targetSlug,
      mistakeCount: 1,
      consecutiveCorrect: 0,
      easeFactor: 2500,
      intervalDays: 1,
      lastMistakeAt: new Date(),
      nextReviewAt: nextReview,
      isResolved: false,
      resolvedAt: null,
    })
    .onConflictDoUpdate({
      target: [
        userMistakeItems.userId,
        userMistakeItems.targetType,
        userMistakeItems.targetSlug,
      ],
      set: {
        mistakeCount: sql`${userMistakeItems.mistakeCount} + 1`,
        consecutiveCorrect: 0,
        easeFactor: sql`GREATEST(1300, ${userMistakeItems.easeFactor} - 200)`,
        intervalDays: 1,
        lastMistakeAt: new Date(),
        nextReviewAt: nextReview,
        isResolved: false,
        resolvedAt: null,
        updatedAt: new Date(),
      },
    });
}

async function recordCorrectFallback(
  userId: string,
  targetType: PracticeTargetType,
  targetSlug: string,
) {
  const [existing] = await db
    .select()
    .from(userMistakeItems)
    .where(
      and(
        eq(userMistakeItems.userId, userId),
        eq(userMistakeItems.targetType, targetType),
        eq(userMistakeItems.targetSlug, targetSlug),
      ),
    )
    .limit(1);

  if (!existing) return;

  const nextConsecutive = existing.consecutiveCorrect + 1;
  const nextEase = Math.min(3000, existing.easeFactor + 100);
  let nextInterval = 1;
  if (existing.consecutiveCorrect === 1) nextInterval = 6;
  else if (existing.consecutiveCorrect > 1) {
    nextInterval = Math.min(
      32767,
      Math.round(existing.intervalDays * (nextEase / 1000)),
    );
  }
  const isResolved = nextConsecutive >= 3;

  await db
    .update(userMistakeItems)
    .set({
      consecutiveCorrect: nextConsecutive,
      easeFactor: nextEase,
      intervalDays: nextInterval,
      nextReviewAt: new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000),
      isResolved,
      resolvedAt: isResolved ? (existing.resolvedAt ?? new Date()) : null,
      updatedAt: new Date(),
    })
    .where(eq(userMistakeItems.id, existing.id));
}

export async function recordPracticeAttempt(
  input: RecordPracticeAttemptInput,
): Promise<{ ok: boolean }> {
  const parsed = safeParse(RecordPracticeAttemptInputSchema, input);
  if (!parsed.success) return { ok: false };

  try {
    const userId = await getSessionUserId();
    if (!userId) return { ok: false };

    const { targetType, targetSlug, isCorrect } = parsed.output;

    try {
      await db.execute(
        sql`SELECT fn_record_practice_attempt(${userId}, ${targetType}::practice_target_type, ${targetSlug}, ${isCorrect})`,
      );
      return { ok: true };
    } catch (fnError) {
      console.warn(
        '[recordPracticeAttempt] fn_record_practice_attempt fallback:',
        fnError,
      );

      if (isCorrect) {
        await recordCorrectFallback(userId, targetType, targetSlug);
      } else {
        await recordMistakeFallback(userId, targetType, targetSlug);
      }

      return { ok: true };
    }
  } catch (error) {
    unstable_rethrow(error);
    console.error('[recordPracticeAttempt] Error:', error);
    return { ok: false };
  }
}

export async function toggleSavedItem(
  input: ToggleSavedItemInput,
): Promise<{ ok: boolean; isSaved: boolean }> {
  const parsed = safeParse(ToggleSavedItemInputSchema, input);
  if (!parsed.success) return { ok: false, isSaved: false };

  try {
    const userId = await getSessionUserId();
    if (!userId) return { ok: false, isSaved: false };

    const { targetType, targetSlug } = parsed.output;

    const [existing] = await db
      .select({ id: userSavedItems.id })
      .from(userSavedItems)
      .where(
        and(
          eq(userSavedItems.userId, userId),
          eq(userSavedItems.targetType, targetType),
          eq(userSavedItems.targetSlug, targetSlug),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .delete(userSavedItems)
        .where(
          and(
            eq(userSavedItems.id, existing.id),
            eq(userSavedItems.userId, userId),
          ),
        );
      return { ok: true, isSaved: false };
    }

    await db
      .insert(userSavedItems)
      .values({ userId, targetType, targetSlug })
      .onConflictDoNothing();

    return { ok: true, isSaved: true };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[toggleSavedItem] Error:', error);
    return { ok: false, isSaved: false };
  }
}

function buildChoicesFromQuestionData(
  questionType: string,
  data: CurQuestionData,
): QuizSessionChoice[] {
  if (
    (questionType === 'multiple_choice' || questionType === 'audio_guess') &&
    Array.isArray(data.options)
  ) {
    return data.options.map((opt) => {
      if (typeof opt === 'string') {
        return {
          id: opt,
          labelText: formatSlugTitle(opt),
          isCorrect: opt === data.correctOption,
        };
      }
      return {
        id: opt.id,
        labelKey: opt.textKey,
        labelText: formatSlugTitle(opt.textKey),
        isCorrect: opt.id === data.correctOptionId,
      };
    });
  }

  if (
    questionType === 'true_false' &&
    typeof data.correctBoolean === 'boolean'
  ) {
    return [
      { id: 'true', labelText: 'True', isCorrect: data.correctBoolean },
      { id: 'false', labelText: 'False', isCorrect: !data.correctBoolean },
    ];
  }

  if (questionType === 'complete_matan' && Array.isArray(data.choices)) {
    return data.choices.map((choice) => ({
      id: choice,
      labelText: choice,
      isCorrect: choice === data.missingWord,
    }));
  }

  if (questionType === 'spot_in_ayah' && Array.isArray(data.tokens)) {
    return data.tokens.map((token) => ({
      id: token,
      labelText: token,
      isCorrect: token === data.correctToken,
    }));
  }

  if (questionType === 'match_pairs' && Array.isArray(data.pairs)) {
    const firstPair = data.pairs[0];
    const rightValues = data.pairs
      .map((p) => p.right ?? p.rightKey ?? '')
      .filter((v) => v.length > 0);
    const correctRight = firstPair?.right ?? firstPair?.rightKey ?? '';
    return rightValues.map((val) => ({
      id: val,
      labelText: val.includes('_')
        ? formatSlugTitle(val.replaceAll('_', '-'))
        : val,
      isCorrect: val === correctRight,
    }));
  }

  return [];
}

function normalizeCurQuestion(
  row: typeof curQuestions.$inferSelect,
  savedQuestionSlugs: ReadonlySet<string>,
): QuizSessionQuestion | null {
  const parsed = safeParse(CurQuestionDataSchema, row.questionData);
  if (!parsed.success) return null;

  const data = parsed.output;
  const choices = buildChoicesFromQuestionData(row.questionType, data);
  if (choices.length === 0) return null;

  return {
    slug: row.slug,
    questionType: row.questionType,
    difficulty: row.difficulty,
    promptKey: data.promptKey,
    promptText: formatSlugTitle(row.slug),
    arabicFocus: data.arabicFocus ?? data.arabicTarget,
    choices,
    isSaved: savedQuestionSlugs.has(row.slug),
  };
}

async function buildRelationalUnitQuestions(
  savedQuestionSlugs: ReadonlySet<string>,
): Promise<QuizSessionQuestion[]> {
  const [letters, points, mappings] = await Promise.all([
    db.select().from(hijLetters).orderBy(asc(hijLetters.sortOrder)),
    db
      .select()
      .from(hijArticulationPoints)
      .orderBy(asc(hijArticulationPoints.sortOrder)),
    db.select().from(hijLetterArticulations),
  ]);

  if (letters.length === 0 || points.length === 0 || mappings.length === 0) {
    return [];
  }

  const letterById = new Map(letters.map((l) => [l.id, l]));
  const pointById = new Map(points.map((p) => [p.id, p]));
  const questions: QuizSessionQuestion[] = [];

  for (const mapping of mappings.slice(0, 5)) {
    const letter = letterById.get(mapping.letterId);
    const point = pointById.get(mapping.pointId);
    if (!letter || !point) continue;

    const distractors = points.filter((p) => p.id !== point.id).slice(0, 3);
    const options = [point, ...distractors].map((p) => ({
      id: p.slug,
      labelText: formatSlugTitle(p.slug),
      isCorrect: p.id === point.id,
    }));

    const slug = `rel-${letter.slug}-${point.slug}`;
    questions.push({
      slug,
      questionType: 'multiple_choice',
      difficulty: 1,
      promptText: `Identify the articulation point for ${letter.symbol}`,
      arabicFocus: letter.symbol,
      choices: options,
      isSaved: savedQuestionSlugs.has(slug),
    });
  }

  return questions;
}

export async function getUnitQuizQuestions(
  topicSlug: string,
  unitSlug: string,
): Promise<QuizSessionQuestion[]> {
  try {
    const userId = await getSessionUserId();

    const [dbQuestions, savedRows] = await Promise.all([
      db
        .select()
        .from(curQuestions)
        .where(
          and(
            eq(curQuestions.topicSlug, topicSlug),
            eq(curQuestions.unitSlug, unitSlug),
          ),
        )
        .orderBy(asc(curQuestions.sortOrder)),
      userId
        ? db
            .select({ targetSlug: userSavedItems.targetSlug })
            .from(userSavedItems)
            .where(
              and(
                eq(userSavedItems.userId, userId),
                eq(userSavedItems.targetType, 'question'),
              ),
            )
        : Promise.resolve([]),
    ]);

    const savedSlugs = new Set(savedRows.map((r) => r.targetSlug));
    const normalizedDb = dbQuestions
      .map((row) => normalizeCurQuestion(row, savedSlugs))
      .filter((item): item is QuizSessionQuestion => item !== null);

    const authored = getAuthoredQuiz(topicSlug)?.units[unitSlug];
    if (authored && normalizedDb.length < 5) {
      const topicKey = topicSlug.replaceAll('-', '_');
      const unitKey = unitSlug.replaceAll('-', '_');
      const existingPrompts = new Set(normalizedDb.map((q) => q.promptKey));

      for (const q of authored.questions) {
        const promptKey = `quiz_content.${topicKey}.${unitKey}.${q.key}.question`;
        if (existingPrompts.has(promptKey)) continue;

        const slug = `${topicSlug}-${unitSlug}-${q.key}`;
        normalizedDb.push({
          slug,
          questionType: q.type,
          difficulty: 1,
          promptKey,
          choices: q.answers.map((ans) => ({
            id: ans.key,
            labelKey: `quiz_content.${topicKey}.${unitKey}.${q.key}.${ans.key}`,
            isCorrect: ans.isCorrect,
          })),
          isSaved: savedSlugs.has(slug),
        });
        if (normalizedDb.length >= 5) break;
      }
    }

    if (normalizedDb.length > 0) {
      return normalizedDb;
    }

    return await buildRelationalUnitQuestions(savedSlugs);
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getUnitQuizQuestions] Error:', error);
    return [];
  }
}
