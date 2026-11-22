'use server';

import { and, asc, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { parse } from 'valibot';

import { userUnitProgress } from '@/db/curriculum-schema';
import {
  hijArticulationAreas,
  hijArticulationPoints,
  hijLetterArticulations,
  hijLetters,
  hijLetterTraits,
  hijTraitGroups,
  hijTraits,
} from '@/db/hijaiyyah-schema';
import {
  hijArticulationCitations,
  hijTraitCitations,
  mvTajwidReference,
  refSources,
  refVerses,
  tajExamples,
  tajRuleCitations,
  tajRuleDefinitions,
  tajRules,
} from '@/db/tajwid-schema';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

import {
  type ArticulationGroup,
  type CitationEntry,
  type Letter,
  type LettersDirectoryData,
  type LetterStatus,
  type ReferenceVerse,
  type RuleCategory,
  type TajwidCitation,
  type TajwidExample,
  type TajwidReferenceData,
  TajwidReferenceDataSchema,
  type TopicReferenceSection,
} from '../_schemas/reference';

const AREA_DISPLAY_MAP: Record<string, { id: string; titleKey: string }> = {
  'al-jauf': { id: 'jauf', titleKey: 'makhraj.jauf' },
  'al-halq': { id: 'halq', titleKey: 'makhraj.halq' },
  'al-lisan': { id: 'lisan', titleKey: 'makhraj.lisan' },
  'asy-syafatain': { id: 'shafatayn', titleKey: 'makhraj.shafatayn' },
  'al-khaisyum': { id: 'khayshum', titleKey: 'makhraj.khayshum' },
};

interface LetterDisplayConfig {
  id: string;
  nameKey: string;
  symbol?: string;
}

const PRIMARY_LETTER_DISPLAY_MAP: Record<string, LetterDisplayConfig> = {
  alif: { id: 'alif-mad', nameKey: 'letters.alif_mad', symbol: 'ـَا' },
  'waw-maddiyyah': { id: 'waw-mad', nameKey: 'letters.waw_mad', symbol: 'ـُو' },
  'ya-maddiyyah': { id: 'ya-mad', nameKey: 'letters.ya_mad', symbol: 'ـِي' },
  hamzah: { id: 'hamza', nameKey: 'letters.hamza' },
  'ha-aqsha': { id: 'ha', nameKey: 'letters.ha' },
  ayn: { id: 'ain', nameKey: 'letters.ain' },
  'ha-wasath': { id: 'ha-wasath', nameKey: 'letters.ha_wasath' },
  ghain: { id: 'ghain', nameKey: 'letters.ghain' },
  kha: { id: 'kha', nameKey: 'letters.kha' },
  qaf: { id: 'qaf', nameKey: 'letters.qaf' },
  kaf: { id: 'kaf', nameKey: 'letters.kaf' },
  jim: { id: 'jim', nameKey: 'letters.jim' },
  shin: { id: 'shin', nameKey: 'letters.shin' },
  'ya-ghairu-maddiyyah': { id: 'ya', nameKey: 'letters.ya', symbol: 'ي' },
  dhad: { id: 'dad', nameKey: 'letters.dad' },
  lam: { id: 'lam', nameKey: 'letters.lam' },
  nun: { id: 'nun', nameKey: 'letters.nun' },
  ra: { id: 'ra', nameKey: 'letters.ra' },
  ta: { id: 'ta', nameKey: 'letters.ta' },
  dal: { id: 'dal', nameKey: 'letters.dal' },
  tha: { id: 'ta_mafkhama', nameKey: 'letters.ta_mafkhama' },
  zay: { id: 'za', nameKey: 'letters.za' },
  sin: { id: 'sin', nameKey: 'letters.sin' },
  shad: { id: 'sad', nameKey: 'letters.sad' },
  tsa: { id: 'tha', nameKey: 'letters.tha' },
  dhal: { id: 'dhal', nameKey: 'letters.dhal' },
  zha: { id: 'dha', nameKey: 'letters.dha' },
  fa: { id: 'fa', nameKey: 'letters.fa' },
  ba: { id: 'ba', nameKey: 'letters.ba' },
  mim: { id: 'mim', nameKey: 'letters.mim' },
  'waw-ghairu-maddiyyah': { id: 'waw', nameKey: 'letters.waw', symbol: 'و' },
};

const SECONDARY_LETTER_DISPLAY_MAP: Record<string, LetterDisplayConfig> = {
  nun: { id: 'nun-ghunna', nameKey: 'letters.nun_ghunna', symbol: 'نّ' },
  mim: { id: 'mim-ghunna', nameKey: 'letters.mim_ghunna', symbol: 'مّ' },
};

const POINT_TO_UNIT_SLUG: Record<string, string> = {
  jauf: 'jauf',
  'aqsha-halq': 'halq',
  'wasath-halq': 'halq',
  'adna-halq': 'halq',
  'aqsha-lisan-fauq': 'aqsha-lisan-fauq',
  'aqsha-lisan-asfal': 'aqsha-lisan-fauq',
  'wasath-lisan': 'wasath-lisan',
  'hafah-lisan-adhras': 'hafah-lisan-adhras',
  'adna-hafah-lisan': 'hafah-lisan-adhras',
  'tharaf-lisan-taht': 'tharaf-lisan-taht',
  'tharaf-lisan-zhahr-adkhal': 'tharaf-lisan-taht',
  'tharaf-lisan-ushul-tsanaya': 'tsanaya',
  'tharaf-lisan-fauq-tsanaya-sufla': 'tsanaya',
  'tharaf-lisan-athraf-tsanaya-ulya': 'tsanaya',
  'bathn-syafah-sufla': 'syafatain',
  syafatain: 'syafatain',
  khaisyum: 'khaisyum',
};

const DEFAULT_LEARNED_POINTS = new Set(['jauf', 'aqsha-halq']);
const DEFAULT_AVAILABLE_POINTS = new Set(['wasath-halq']);

const TOPIC_TO_RULE_CATEGORIES: Record<string, readonly RuleCategory[]> = {
  'noble-quran': ['other'],
  'tajweed-science': ['other'],
  'istiadah-basmalah': ['istiadah_basmalah'],
  'common-mistakes': ['other'],
  'meeting-letters': ['letter_relations'],
  'mim-nun-rules': ['nun_sukun_tanwin', 'mim_sukun', 'nun_mim_musyaddadatain'],
  'mad-rules': ['madd_letters'],
  'vowel-completion': ['itmamul_harakat'],
  'meeting-sukoons': ['iltiqaus_sakinain'],
  miscellaneous: [
    'lam_tarif',
    'lam_sakinah',
    'ro_condition',
    'lafzul_jalalah',
    'qalqalah',
  ],
  nabr: ['nabr'],
  'special-words': ['kalimat_khashshah', 'saktah'],
  'waqf-ibtida': ['waqf_ibtida'],
  'roum-ishmam': ['waqf_ibtida'],
  'seven-alifs': ['alifat_sabah'],
  'hamzat-wasl': ['hamzat_wasl'],
  'hamzat-qata': ['hamzat_qata'],
  'mushaf-signs': ['rasm_utsmani', 'dhabth_mushaf'],
  'modern-spelling': ['rasm_utsmani'],
};

const DEFAULT_DIRECTORY_FALLBACK: LettersDirectoryData = {
  groups: [
    {
      id: 'jauf',
      titleKey: 'makhraj.jauf',
      letters: [
        {
          id: 'alif-mad',
          letterSlug: 'alif',
          symbol: 'ـَا',
          nameKey: 'letters.alif_mad',
          makhraj: 'jauf',
          status: 'learned',
          pointSlug: 'jauf',
          tafkhimType: 'conditional',
          traitSlugs: [],
          examples: [],
          citations: [],
        },
        {
          id: 'waw-mad',
          letterSlug: 'waw-maddiyyah',
          symbol: 'ـُو',
          nameKey: 'letters.waw_mad',
          makhraj: 'jauf',
          status: 'learned',
          pointSlug: 'jauf',
          tafkhimType: 'always_tarqiq',
          traitSlugs: [],
          examples: [],
          citations: [],
        },
        {
          id: 'ya-mad',
          letterSlug: 'ya-maddiyyah',
          symbol: 'ـِي',
          nameKey: 'letters.ya_mad',
          makhraj: 'jauf',
          status: 'learned',
          pointSlug: 'jauf',
          tafkhimType: 'always_tarqiq',
          traitSlugs: [],
          examples: [],
          citations: [],
        },
      ],
    },
  ],
  total: 3,
  learned: 3,
  available: 0,
  locked: 0,
};

function resolveVersesInRange(
  versesBySource: Map<number, ReferenceVerse[]>,
  sourceId: number,
  verseStart: number,
  verseEnd: number | null,
): ReferenceVerse[] {
  const sourceVerses = versesBySource.get(sourceId) ?? [];
  const end = verseEnd ?? verseStart;
  return sourceVerses.filter(
    (v) => v.verseNumber >= verseStart && v.verseNumber <= end,
  );
}

async function fetchDirectTajwidReferenceData(): Promise<TajwidReferenceData> {
  const [rules, definitions, examples, citations, sources, verses] =
    await Promise.all([
      db.select().from(tajRules).orderBy(asc(tajRules.sortOrder)),
      db.select().from(tajRuleDefinitions),
      db.select().from(tajExamples).orderBy(asc(tajExamples.sortOrder)),
      db.select().from(tajRuleCitations),
      db.select().from(refSources),
      db.select().from(refVerses).orderBy(asc(refVerses.verseNumber)),
    ]);

  const sourceSlugById = new Map(sources.map((s) => [s.id, s.slug]));
  const versesBySource = new Map<number, ReferenceVerse[]>();
  for (const v of verses) {
    const existing = versesBySource.get(v.sourceId) ?? [];
    existing.push({ verseNumber: v.verseNumber, arabicText: v.arabicText });
    versesBySource.set(v.sourceId, existing);
  }

  const mappedCitations: TajwidCitation[] = citations.map((c) => ({
    id: c.id,
    ruleId: c.ruleId,
    sourceSlug: sourceSlugById.get(c.sourceId) ?? '',
    verseStart: c.verseStart,
    verseEnd: c.verseEnd,
    verses: resolveVersesInRange(
      versesBySource,
      c.sourceId,
      c.verseStart,
      c.verseEnd,
    ),
  }));

  return {
    rules,
    definitions,
    examples,
    citations: mappedCitations,
  };
}

export async function getTajwidReferenceData(): Promise<TajwidReferenceData> {
  try {
    const mvRows = await db
      .select({ data: mvTajwidReference.data })
      .from(mvTajwidReference)
      .limit(1);

    const rawData = mvRows[0]?.data;
    if (rawData) {
      return parse(TajwidReferenceDataSchema, rawData);
    }

    return await fetchDirectTajwidReferenceData();
  } catch (error) {
    unstable_rethrow(error);
    try {
      return await fetchDirectTajwidReferenceData();
    } catch (fallbackError) {
      unstable_rethrow(fallbackError);
      console.error('[getTajwidReferenceData] Error:', fallbackError);
      return { rules: [], definitions: [], examples: [], citations: [] };
    }
  }
}

async function getArticulationAndTraitCitations(): Promise<{
  byPointId: Map<number, CitationEntry[]>;
  byTraitId: Map<number, CitationEntry[]>;
  allArticulationCitations: CitationEntry[];
  allTraitCitations: CitationEntry[];
}> {
  const [artCitations, traitCitations, sources, verses] = await Promise.all([
    db.select().from(hijArticulationCitations),
    db.select().from(hijTraitCitations),
    db.select().from(refSources),
    db.select().from(refVerses).orderBy(asc(refVerses.verseNumber)),
  ]);

  const sourceSlugById = new Map(sources.map((s) => [s.id, s.slug]));
  const versesBySource = new Map<number, ReferenceVerse[]>();
  for (const v of verses) {
    const existing = versesBySource.get(v.sourceId) ?? [];
    existing.push({ verseNumber: v.verseNumber, arabicText: v.arabicText });
    versesBySource.set(v.sourceId, existing);
  }

  const byPointId = new Map<number, CitationEntry[]>();
  const allArticulationCitations: CitationEntry[] = [];
  for (const c of artCitations) {
    const entry: CitationEntry = {
      id: c.id,
      sourceSlug: sourceSlugById.get(c.sourceId) ?? '',
      verseStart: c.verseStart,
      verseEnd: c.verseEnd,
      verses: resolveVersesInRange(
        versesBySource,
        c.sourceId,
        c.verseStart,
        c.verseEnd,
      ),
    };
    allArticulationCitations.push(entry);
    const list = byPointId.get(c.pointId) ?? [];
    list.push(entry);
    byPointId.set(c.pointId, list);
  }

  const byTraitId = new Map<number, CitationEntry[]>();
  const allTraitCitations: CitationEntry[] = [];
  for (const c of traitCitations) {
    const entry: CitationEntry = {
      id: c.id,
      sourceSlug: sourceSlugById.get(c.sourceId) ?? '',
      verseStart: c.verseStart,
      verseEnd: c.verseEnd,
      verses: resolveVersesInRange(
        versesBySource,
        c.sourceId,
        c.verseStart,
        c.verseEnd,
      ),
    };
    allTraitCitations.push(entry);
    const list = byTraitId.get(c.traitId) ?? [];
    list.push(entry);
    byTraitId.set(c.traitId, list);
  }

  return {
    byPointId,
    byTraitId,
    allArticulationCitations,
    allTraitCitations,
  };
}

function resolveLetterStatus(
  pointSlug: string,
  completedUnits: Set<string>,
): LetterStatus {
  if (completedUnits.size === 0) {
    if (DEFAULT_LEARNED_POINTS.has(pointSlug)) return 'learned';
    if (DEFAULT_AVAILABLE_POINTS.has(pointSlug)) return 'available';
    return 'locked';
  }

  const unitSlug = POINT_TO_UNIT_SLUG[pointSlug];
  if (unitSlug && completedUnits.has(unitSlug)) return 'learned';
  return 'available';
}

function buildDirectoryDisplayEntry(
  letterSlug: string,
  isPrimary: boolean,
  fallbackSymbol: string,
): { id: string; nameKey: string; symbol: string } {
  const lookup = isPrimary
    ? PRIMARY_LETTER_DISPLAY_MAP[letterSlug]
    : SECONDARY_LETTER_DISPLAY_MAP[letterSlug];

  if (lookup) {
    return {
      id: lookup.id,
      nameKey: lookup.nameKey,
      symbol: lookup.symbol ?? fallbackSymbol,
    };
  }

  return {
    id: `${letterSlug}${isPrimary ? '' : '-ghunna'}`,
    nameKey: `letters.${letterSlug.replaceAll('-', '_')}`,
    symbol: fallbackSymbol,
  };
}

function buildTraitSlugsByLetterId(
  traitGroups: readonly (typeof hijTraitGroups.$inferSelect)[],
  traits: readonly (typeof hijTraits.$inferSelect)[],
  letterTraits: readonly (typeof hijLetterTraits.$inferSelect)[],
): Map<number, string[]> {
  const lazimahGroupIds = new Set(
    traitGroups.filter((g) => g.isLazimah).map((g) => g.id),
  );
  const traitById = new Map(traits.map((t) => [t.id, t]));
  const traitSlugsByLetterId = new Map<number, string[]>();

  for (const lt of letterTraits) {
    const trait = traitById.get(lt.traitId);
    if (!trait || !lazimahGroupIds.has(trait.groupId)) continue;
    const list = traitSlugsByLetterId.get(lt.letterId) ?? [];
    list.push(trait.slug);
    traitSlugsByLetterId.set(lt.letterId, list);
  }

  return traitSlugsByLetterId;
}

function buildExamplesByLetterId(
  examples: readonly TajwidExample[],
): Map<number, TajwidExample[]> {
  const examplesByLetterId = new Map<number, TajwidExample[]>();

  for (const ex of examples) {
    if (ex.letterId === null) continue;
    const list = examplesByLetterId.get(ex.letterId) ?? [];
    list.push(ex);
    examplesByLetterId.set(ex.letterId, list);
  }

  return examplesByLetterId;
}

function resolveLetterExamples(
  letter: typeof hijLetters.$inferSelect,
  letterIdBySlug: ReadonlyMap<string, number>,
  examplesByLetterId: ReadonlyMap<number, TajwidExample[]>,
): TajwidExample[] {
  const direct = examplesByLetterId.get(letter.id);
  if (direct) return direct;
  if (!letter.parentLetterSlug) return [];
  const parentId = letterIdBySlug.get(letter.parentLetterSlug);
  return parentId ? (examplesByLetterId.get(parentId) ?? []) : [];
}

export async function getLettersDirectoryData(): Promise<LettersDirectoryData> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const [
      areas,
      points,
      letterArticulations,
      letters,
      traitGroups,
      traits,
      letterTraits,
      examples,
      citationsData,
      progressRows,
    ] = await Promise.all([
      db
        .select()
        .from(hijArticulationAreas)
        .orderBy(asc(hijArticulationAreas.sortOrder)),
      db
        .select()
        .from(hijArticulationPoints)
        .orderBy(asc(hijArticulationPoints.sortOrder)),
      db
        .select()
        .from(hijLetterArticulations)
        .orderBy(asc(hijLetterArticulations.sortOrder)),
      db.select().from(hijLetters).orderBy(asc(hijLetters.sortOrder)),
      db.select().from(hijTraitGroups).orderBy(asc(hijTraitGroups.sortOrder)),
      db.select().from(hijTraits).orderBy(asc(hijTraits.sortOrder)),
      db.select().from(hijLetterTraits),
      db.select().from(tajExamples).orderBy(asc(tajExamples.sortOrder)),
      getArticulationAndTraitCitations(),
      userId
        ? db
            .select()
            .from(userUnitProgress)
            .where(
              and(
                eq(userUnitProgress.userId, userId),
                eq(userUnitProgress.topicSlug, 'articulation-points'),
              ),
            )
        : Promise.resolve([]),
    ]);

    if (areas.length === 0 || letterArticulations.length === 0) {
      return DEFAULT_DIRECTORY_FALLBACK;
    }

    const completedUnits = new Set(
      progressRows.filter((r) => r.isCompleted).map((r) => r.unitSlug),
    );
    const letterById = new Map(letters.map((l) => [l.id, l]));
    const letterIdBySlug = new Map(letters.map((l) => [l.slug, l.id]));
    const pointById = new Map(points.map((p) => [p.id, p]));
    const areaById = new Map(areas.map((a) => [a.id, a]));
    const traitSlugsByLetterId = buildTraitSlugsByLetterId(
      traitGroups,
      traits,
      letterTraits,
    );
    const examplesByLetterId = buildExamplesByLetterId(examples);

    const lettersByGroupId = new Map<string, Letter[]>();
    for (const la of letterArticulations) {
      const letter = letterById.get(la.letterId);
      const point = pointById.get(la.pointId);
      const area = point ? areaById.get(point.areaId) : undefined;
      if (!letter || !point || !area) continue;

      const areaMeta = AREA_DISPLAY_MAP[area.slug] ?? {
        id: area.slug,
        titleKey: `makhraj.${area.slug}`,
      };
      const display = buildDirectoryDisplayEntry(
        letter.slug,
        la.isPrimary,
        letter.symbol,
      );
      const letterExamples = resolveLetterExamples(
        letter,
        letterIdBySlug,
        examplesByLetterId,
      );

      const list = lettersByGroupId.get(areaMeta.id) ?? [];
      list.push({
        id: display.id,
        letterSlug: letter.slug,
        symbol: display.symbol,
        nameKey: display.nameKey,
        makhraj: areaMeta.id,
        status: resolveLetterStatus(point.slug, completedUnits),
        pointSlug: point.slug,
        tafkhimType: letter.tafkhimType,
        traitSlugs: traitSlugsByLetterId.get(letter.id) ?? [],
        examples: letterExamples.slice(0, 3),
        citations: citationsData.byPointId.get(point.id) ?? [],
      });
      lettersByGroupId.set(areaMeta.id, list);
    }

    const groups: ArticulationGroup[] = areas.map((area) => {
      const areaMeta = AREA_DISPLAY_MAP[area.slug] ?? {
        id: area.slug,
        titleKey: `makhraj.${area.slug}`,
      };
      return {
        id: areaMeta.id,
        titleKey: areaMeta.titleKey,
        letters: lettersByGroupId.get(areaMeta.id) ?? [],
      };
    });

    const allLetters = groups.flatMap((g) => g.letters);
    return {
      groups,
      total: allLetters.length,
      learned: allLetters.filter((l) => l.status === 'learned').length,
      available: allLetters.filter((l) => l.status === 'available').length,
      locked: allLetters.filter((l) => l.status === 'locked').length,
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getLettersDirectoryData] Error:', error);
    return DEFAULT_DIRECTORY_FALLBACK;
  }
}

export async function getTopicReferenceDetails(
  topicSlug: string,
): Promise<TopicReferenceSection[]> {
  try {
    if (topicSlug === 'articulation-points') {
      const { allArticulationCitations } =
        await getArticulationAndTraitCitations();
      if (allArticulationCitations.length === 0) return [];
      return [
        {
          slug: 'articulation-points',
          category: 'other',
          examples: [],
          citations: allArticulationCitations,
          definitionsCount: 0,
        },
      ];
    }

    if (topicSlug === 'letter-characteristics') {
      const { allTraitCitations } = await getArticulationAndTraitCitations();
      if (allTraitCitations.length === 0) return [];
      return [
        {
          slug: 'letter-characteristics',
          category: 'other',
          examples: [],
          citations: allTraitCitations,
          definitionsCount: 0,
        },
      ];
    }

    const categories = TOPIC_TO_RULE_CATEGORIES[topicSlug];
    if (!categories || categories.length === 0) return [];

    const referenceData = await getTajwidReferenceData();
    const categorySet = new Set<RuleCategory>(categories);
    const matchingRules = referenceData.rules.filter((r) =>
      categorySet.has(r.category),
    );

    return matchingRules
      .map((rule) => {
        const examples = referenceData.examples.filter(
          (ex) => ex.ruleId === rule.id,
        );
        const citations = referenceData.citations
          .filter((cit) => cit.ruleId === rule.id)
          .map((cit) => ({
            id: cit.id,
            sourceSlug: cit.sourceSlug,
            verseStart: cit.verseStart,
            verseEnd: cit.verseEnd,
            verses: cit.verses,
          }));
        const definitionsCount = referenceData.definitions.filter(
          (def) => def.ruleId === rule.id,
        ).length;

        return {
          slug: rule.slug,
          category: rule.category,
          examples,
          citations,
          definitionsCount,
        };
      })
      .filter(
        (section) =>
          section.examples.length > 0 ||
          section.citations.length > 0 ||
          section.definitionsCount > 0,
      );
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getTopicReferenceDetails] Error:', error);
    return [];
  }
}
