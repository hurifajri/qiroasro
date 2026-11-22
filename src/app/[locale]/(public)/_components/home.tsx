'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CompassIcon,
  DownloadIcon,
  FlameIcon,
  GlobeIcon,
  LayoutGridIcon,
  LockOpenIcon,
  NetworkIcon,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
  ZapIcon,
} from 'lucide-react';
import * as m from 'motion/react-m';
import { useLocale, useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useMemo, useRef } from 'react';

import { NodeButton } from '@/components/common/node-button';
import {
  ArticulationPointNodeShell,
  LETTER_TAFKHIM_GRADIENT,
  LetterNodeShell,
  TraitNodeShell,
} from '@/components/graph/tajweed-node';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { TajweedGraphShowcase } from '@/features/tajweed-graph/components/tajweed-graph-showcase';
import { useTajweedLetterCycle } from '@/features/tajweed-graph/hooks/use-tajweed-letter-cycle';
import { getRootLetters } from '@/features/tajweed-graph/lib/letter';
import { getPlaygroundDataOpt } from '@/features/tajweed-graph/queries/tajweed-graph';
import {
  PARAM_LETTER,
  PARAM_VIEW,
} from '@/features/tajweed-graph/schemas/graph';
import type { Letter } from '@/features/tajweed-graph/schemas/letter';
import { LOCALE_CONFIG } from '@/i18n/config';
import { getLocaleDir } from '@/i18n/locale';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';
import { cn, kebabToSnakeCase } from '@/lib/utils';

type LetterNavigationBarProps = Readonly<{
  letters: readonly Letter[];
  activeLetterId: number | null;
}>;

function LetterNavigationBar({
  letters,
  activeLetterId,
}: LetterNavigationBarProps) {
  const t = useTranslations('home_page.nav_bar');
  const tLetter = useTranslations('global.letter');
  const dir = getLocaleDir(useLocale() as Locale);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (isHoveredRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    if (activeLetterId === null) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    const itemEl = itemRefs.current.get(activeLetterId);
    if (!itemEl) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const delta =
      itemRect.left +
      itemRect.width / 2 -
      (containerRect.left + containerRect.width / 2);

    container.scrollBy({ left: delta, behavior: 'smooth' });
  }, [activeLetterId]);

  if (letters.length === 0) return null;

  function handleScroll(direction: number) {
    const container = scrollContainerRef.current;
    if (!container) return;
    const sign = dir === 'rtl' ? -1 : 1;
    container.scrollBy({ left: direction * sign * 260, behavior: 'smooth' });
  }

  return (
    <div className="border-y border-border bg-card/60">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleScroll(-1)}
          aria-label={t('prev')}
          className="shrink-0 rounded-full text-muted-foreground"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
        </Button>

        <nav
          ref={scrollContainerRef}
          aria-label={t('aria_label')}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {letters.map((letter) => {
            const isActive = letter.id === activeLetterId;

            return (
              <div
                key={letter.id}
                ref={(el) => {
                  if (el) {
                    itemRefs.current.set(letter.id, el);
                  } else {
                    itemRefs.current.delete(letter.id);
                  }
                }}
                className="shrink-0"
              >
                <Link
                  href={`/playground?${PARAM_VIEW}=letter&${PARAM_LETTER}=${letter.id}`}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'h-auto gap-2 rounded-xl px-3 py-1.5 transition-all',
                    isActive &&
                      'bg-accent shadow-xs ring-2 ring-node-letter/60',
                  )}
                >
                  <span
                    lang="ar"
                    dir="rtl"
                    className={cn(
                      'inline-flex size-7 items-center justify-center rounded-full bg-linear-to-br font-arabic text-sm font-bold text-node-letter-text shadow-xs transition-transform',
                      LETTER_TAFKHIM_GRADIENT[letter.tafkhimType],
                      isActive && 'scale-110',
                    )}
                  >
                    {letter.symbol}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isActive ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {tLetter(kebabToSnakeCase(letter.slug))}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleScroll(1)}
          aria-label={t('next')}
          className="shrink-0 rounded-full text-muted-foreground"
        >
          <ChevronRightIcon className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}

function HeroWithLetterNavigation() {
  const t = useTranslations('home_page.hero');
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());

  const rootLetters = useMemo(
    () => getRootLetters(playgroundData?.letters ?? []),
    [playgroundData?.letters],
  );
  const activeLetterId = useTajweedLetterCycle(rootLetters);

  return (
    <div className="flex flex-col lg:min-h-[calc(100dvh-49px)]">
      {/* 1. Hero Split Section */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-12 sm:px-6 lg:flex-1 lg:flex-row lg:gap-14 lg:py-8">
        <m.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="flex w-full flex-1 justify-center"
        >
          <TajweedGraphShowcase
            activeLetterId={activeLetterId}
            className="w-full max-w-xl lg:h-[min(560px,calc(100dvh-190px))]"
          />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-start"
        >
          <Badge
            variant="secondary"
            className="bg-node-articulation-secondary px-3 py-1 text-xs font-bold text-node-articulation-text"
          >
            <SparklesIcon className="size-3.5" />
            {t('badge')}
          </Badge>

          <h2 className="max-w-lg text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            {t('subtitle')}
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3 pt-1">
            <Button size="lg" asChild className="h-12 text-sm font-bold">
              <Link href="/login">{t('cta_login')}</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 text-sm font-bold"
            >
              <Link href="/playground">{t('cta_playground')}</Link>
            </Button>
          </div>
        </m.div>
      </section>

      {/* 2. Synced Hijaiyyah Letter Navigation Bar */}
      <LetterNavigationBar
        letters={rootLetters}
        activeLetterId={activeLetterId}
      />
    </div>
  );
}

type FeatureSectionRowProps = Readonly<{
  badge: string;
  title: string;
  description: string;
  titleColorClass: string;
  rowLayoutClass: string;
  visual: ReactNode;
}>;

function FeatureSectionRow({
  badge,
  title,
  description,
  titleColorClass,
  rowLayoutClass,
  visual,
}: FeatureSectionRowProps) {
  return (
    <m.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={cn(
        'mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 py-12 sm:px-6 lg:gap-14 lg:py-16',
        rowLayoutClass,
      )}
    >
      <div className="flex flex-1 flex-col items-center gap-3 text-center lg:items-start lg:text-start">
        <Badge variant="outline" className="text-xs font-semibold">
          {badge}
        </Badge>
        <h2
          className={cn(
            'text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl lg:text-4xl',
            titleColorClass,
          )}
        >
          {title}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="w-full max-w-md flex-1">{visual}</div>
    </m.section>
  );
}

function GraphCanvasShowcase() {
  const tHome = useTranslations('home_page.features.knowledge_graph');
  const tPlayground = useTranslations('playground_page');
  const tGlobal = useTranslations('global');

  return (
    <Card className="border-node-articulation/30 bg-card shadow-sm">
      <CardHeader className="border-b border-border/60 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold">
            {tHome('card_title')}
          </CardTitle>
          <Button variant="outline" size="xs" asChild>
            <Link href="/playground">
              <DownloadIcon className="size-3.5" />
              {tPlayground('download.trigger')}
            </Link>
          </Button>
        </div>
        <CardDescription className="text-xs">
          {tHome('card_subtitle')}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ButtonGroup>
            <Button size="xs" variant="default">
              {tPlayground('filter.view_mode.letter')}
            </Button>
            <Button size="xs" variant="outline">
              {tPlayground('filter.view_mode.all')}
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button size="xs" variant="secondary">
              <LayoutGridIcon className="size-3" />
              {tPlayground('filter.layout_mode.radial')}
            </Button>
            <Button size="xs" variant="outline">
              <NetworkIcon className="size-3" />
              {tPlayground('filter.layout_mode.hierarchical')}
            </Button>
          </ButtonGroup>
        </div>

        <div className="flex flex-col gap-2.5 rounded-xl border border-border/70 bg-muted/25 p-3">
          <div className="flex items-center justify-between gap-2">
            <LetterNodeShell
              symbol="ق"
              tafkhimType="always_tafkhim"
              size="sm"
            />
            <div className="flex flex-wrap justify-end gap-1.5">
              <ArticulationPointNodeShell
                label={tGlobal('articulation_point.aqsha_lisan_fauq')}
                className="px-2.5 py-1"
              />
              <TraitNodeShell
                label={tGlobal('trait.qalqalah')}
                className="px-2.5 py-1"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-2">
            <LetterNodeShell symbol="ر" tafkhimType="conditional" size="sm" />
            <div className="flex flex-wrap justify-end gap-1.5">
              <ArticulationPointNodeShell
                label={tGlobal('articulation_point.tharaf_lisan_zhahr_adkhal')}
                className="px-2.5 py-1"
              />
              <TraitNodeShell
                label={tGlobal('trait.takrir')}
                className="px-2.5 py-1"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-2">
            <LetterNodeShell symbol="م" tafkhimType="always_tarqiq" size="sm" />
            <div className="flex flex-wrap justify-end gap-1.5">
              <ArticulationPointNodeShell
                label={tGlobal('articulation_point.syafatain')}
                className="px-2.5 py-1"
              />
              <TraitNodeShell
                label={tGlobal('trait.ghunnah')}
                className="px-2.5 py-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ZigzagPathShowcase() {
  const tHome = useTranslations('home_page.features.structured_curriculum');
  const tLearn = useTranslations('learn_page');
  const tRef = useTranslations('reference_page');

  return (
    <Card className="border-primary/25 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-5 pt-1">
        <Item variant="muted" className="rounded-xl bg-primary p-4 text-white">
          <ItemContent>
            <ItemTitle>
              <ArrowLeftIcon className="size-4 text-white rtl:rotate-180" />
              <span className="text-xs font-bold tracking-wide text-white uppercase">
                {tRef('categories.articulation_points.title')}
              </span>
            </ItemTitle>
            <ItemDescription className="font-bold text-white/95">
              {tLearn('units.halq.title')}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30"
              asChild
            >
              <Link href="/login">
                <BookOpenIcon className="size-4" />
                <span className="hidden sm:inline">
                  {tLearn('read_reference')}
                </span>
              </Link>
            </Button>
          </ItemActions>
        </Item>

        <div className="flex flex-col items-center gap-3 py-2">
          <NodeButton status="completed" size="sm" offset={0} ariaLabel="ء" />
          <NodeButton
            status="in-progress"
            letterSymbol="ع"
            size="sm"
            offset={1}
            startLabel={tLearn('start')}
            ariaLabel="ع"
          />
          <NodeButton
            status="available"
            letterSymbol="ح"
            size="sm"
            offset={0}
            ariaLabel="ح"
          />
          <NodeButton
            type="trophy"
            status="available"
            size="sm"
            offset={-1}
            ariaLabel={tLearn('units.halq.title')}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{tHome('unit_category')}</span>
          <Badge variant="secondary">{tHome('unit_progress')}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ClassicalMatanShowcase() {
  const t = useTranslations('home_page.features.classical_sanad');

  return (
    <Card className="border-node-trait/30 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-3 pt-1">
        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/30 p-3.5">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {t('jazariyyah_title')}
            </span>
            <span>{t('jazariyyah_meta')}</span>
          </div>
          <p
            lang="ar"
            dir="rtl"
            className="text-end font-arabic text-base leading-loose text-foreground"
          >
            مَخَارِجُ الحُرُوفِ سَبْعَةَ عَشَرْ ✽ عَلَى الَّذِي يَخْتَارُهُ مَنِ اخْتَبَرْ
          </p>
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/30 p-3.5">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {t('tuhfah_title')}
            </span>
            <span>{t('tuhfah_meta')}</span>
          </div>
          <p
            lang="ar"
            dir="rtl"
            className="text-end font-arabic text-base leading-loose text-foreground"
          >
            لِلنُّونِ إِنْ تَسْكُنْ وَلِلتَّنْوِينِ ✽ أَرْبَعُ أَحْكَامٍ فَخُذْ تَبْيِينِي
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl border border-node-letter/40 bg-node-letter/10 px-3.5 py-2.5">
          <div className="flex flex-col gap-0.5">
            <Badge variant="outline" className="w-fit font-mono text-xs">
              89:1–2
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">
              {t('example_label')}
            </span>
          </div>
          <p
            lang="ar"
            dir="rtl"
            className="text-end font-arabic text-lg leading-loose font-bold text-foreground"
          >
            وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EvaluationAndHalaqahShowcase() {
  const tHome = useTranslations('home_page.features.interactive_evaluation');
  const tGlobal = useTranslations('global');
  const tQuiz = useTranslations('playground_page.quiz');

  return (
    <Card className="border-node-letter/35 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-3 pt-1">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/30 p-2.5">
            <FlameIcon className="size-4 text-node-letter-tafkhim" />
            <span className="text-sm font-bold tabular-nums">14</span>
            <span className="text-center text-[11px] text-muted-foreground">
              {tHome('stats_streak_days')}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/30 p-2.5">
            <ZapIcon className="size-4 text-node-letter-dark" />
            <span className="text-sm font-bold tabular-nums">1,250 XP</span>
            <span className="text-center text-[11px] text-muted-foreground">
              {tQuiz('challenge_badge_perfect')}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/30 p-2.5">
            <TrophyIcon className="size-4 text-primary" />
            <span className="truncate text-sm font-bold">
              {tGlobal('leagues.paradise')}
            </span>
            <span className="text-center text-[11px] text-muted-foreground">
              {tHome('quest_progress_label')}
            </span>
          </div>
        </div>

        <Item variant="outline" className="rounded-xl p-3">
          <ItemMedia variant="icon">
            <div className="flex size-9 items-center justify-center rounded-lg bg-node-letter/15 text-node-letter-dark">
              <TargetIcon className="size-4" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-xs font-bold">
              {tGlobal('private_layout.quests.earn_xp.title')}
            </ItemTitle>
            <ItemDescription className="text-xs">
              {tGlobal('private_layout.quests.high_accuracy.title')}
            </ItemDescription>
          </ItemContent>
          <Badge variant="secondary">{tHome('challenge_mode_label')}</Badge>
        </Item>
      </CardContent>
    </Card>
  );
}

function AccessComparisonSection() {
  const t = useTranslations('home_page.access_modes');

  const playgroundFeatures = [
    t('playground.feature_1'),
    t('playground.feature_2'),
    t('playground.feature_3'),
    t('playground.feature_4'),
  ];

  const fullLearningFeatures = [
    t('full_learning.feature_1'),
    t('full_learning.feature_2'),
    t('full_learning.feature_3'),
    t('full_learning.feature_4'),
  ];

  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {t('title')}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col justify-between border-node-articulation/40">
            <CardHeader>
              <Badge
                variant="secondary"
                className="w-fit bg-node-articulation-secondary text-node-articulation-text"
              >
                <CompassIcon className="size-3.5" />
                {t('playground.badge')}
              </Badge>
              <CardTitle className="pt-2 text-xl font-bold">
                {t('playground.title')}
              </CardTitle>
              <CardDescription>{t('playground.description')}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {playgroundFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-node-articulation" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="border-t border-border/60 bg-muted/20 py-4">
              <Button variant="outline" size="lg" asChild className="w-full">
                <Link href="/playground">{t('playground.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between border-primary/40 ring-1 ring-primary/20">
            <CardHeader>
              <Badge className="w-fit">
                <LockOpenIcon className="size-3.5" />
                {t('full_learning.badge')}
              </Badge>
              <CardTitle className="pt-2 text-xl font-bold">
                {t('full_learning.title')}
              </CardTitle>
              <CardDescription>
                {t('full_learning.description')}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {fullLearningFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="border-t border-border/60 bg-muted/20 py-4">
              <Button size="lg" asChild className="w-full">
                <Link href="/login">{t('full_learning.cta')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

function BottomCtaSection() {
  const t = useTranslations('home_page.bottom_cta');
  const tLegend = useTranslations('playground_page.legend');

  return (
    <section className="border-t border-border bg-linear-to-b from-background to-node-articulation-secondary/25 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <LetterNodeShell
              symbol="ق"
              tafkhimType="always_tafkhim"
              size="sm"
            />
            <span className="text-[11px] font-medium text-muted-foreground">
              {tLegend('letter_tafkhim')}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <LetterNodeShell symbol="ر" tafkhimType="conditional" size="sm" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {tLegend('letter_conditional')}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <LetterNodeShell symbol="م" tafkhimType="always_tarqiq" size="sm" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {tLegend('letter_tarqiq')}
            </span>
          </div>
        </div>

        <h2 className="max-w-2xl text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {t('title')}
        </h2>
        <p className="max-w-xl text-base text-muted-foreground">
          {t('subtitle')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild className="h-11 px-6">
            <Link href="/login">{t('cta_login')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-11 px-6">
            <Link href="/playground">{t('cta_playground')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  const t = useTranslations('home_page.footer');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleLocaleSwitch(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <h3 className="mb-3 text-sm font-bold">{t('about_title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  {t('about_mission')}
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-foreground">
                  {t('about_methodology')}
                </Link>
              </li>
              <li>
                <Link href="/reference" className="hover:text-foreground">
                  {t('about_sources')}
                </Link>
              </li>
              <li>
                <Link href="/sections" className="hover:text-foreground">
                  {t('about_curriculum')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold">{t('products_title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/playground" className="hover:text-foreground">
                  {t('products_playground')}
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-foreground">
                  {t('products_learn')}
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-foreground">
                  {t('products_practice')}
                </Link>
              </li>
              <li>
                <Link href="/quests" className="hover:text-foreground">
                  {t('products_quests')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold">{t('modules_title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/playground" className="hover:text-foreground">
                  {t('modules_makharij')}
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-foreground">
                  {t('modules_sifat')}
                </Link>
              </li>
              <li>
                <Link
                  href="/reference/letters"
                  className="hover:text-foreground"
                >
                  {t('modules_letters')}
                </Link>
              </li>
              <li>
                <Link href="/reference" className="hover:text-foreground">
                  {t('modules_library')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold">{t('support_title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/playground" className="hover:text-foreground">
                  {t('support_tour')}
                </Link>
              </li>
              <li>
                <Link href="/sections" className="hover:text-foreground">
                  {t('support_faq')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  {t('support_login')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold">{t('legal_title')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  {t('legal_guidelines')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  {t('legal_terms')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  {t('legal_privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <GlobeIcon className="size-4" />
            <span>{t('site_language')}</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {routing.locales.map((loc) => (
              <li key={loc}>
                <Button
                  type="button"
                  variant={loc === locale ? 'secondary' : 'ghost'}
                  size="xs"
                  onClick={() => handleLocaleSwitch(loc)}
                >
                  <span>{LOCALE_CONFIG[loc].flag}</span>
                  <span>{LOCALE_CONFIG[loc].name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function Home() {
  const t = useTranslations('home_page');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <HeroWithLetterNavigation />

      {/* 3. Alternating 4 Core Platform Sections */}
      <div className="divide-y divide-border/50">
        <FeatureSectionRow
          badge={t('features.knowledge_graph.badge')}
          title={t('features.knowledge_graph.title')}
          description={t('features.knowledge_graph.description')}
          titleColorClass="text-node-articulation-text"
          rowLayoutClass="lg:flex-row"
          visual={<GraphCanvasShowcase />}
        />

        <FeatureSectionRow
          badge={t('features.structured_curriculum.badge')}
          title={t('features.structured_curriculum.title')}
          description={t('features.structured_curriculum.description')}
          titleColorClass="text-primary"
          rowLayoutClass="lg:flex-row-reverse"
          visual={<ZigzagPathShowcase />}
        />

        <FeatureSectionRow
          badge={t('features.classical_sanad.badge')}
          title={t('features.classical_sanad.title')}
          description={t('features.classical_sanad.description')}
          titleColorClass="text-node-trait-text"
          rowLayoutClass="lg:flex-row"
          visual={<ClassicalMatanShowcase />}
        />

        <FeatureSectionRow
          badge={t('features.interactive_evaluation.badge')}
          title={t('features.interactive_evaluation.title')}
          description={t('features.interactive_evaluation.description')}
          titleColorClass="text-node-letter-dark"
          rowLayoutClass="lg:flex-row-reverse"
          visual={<EvaluationAndHalaqahShowcase />}
        />
      </div>

      {/* 4. Playground vs Full Learning Comparison */}
      <AccessComparisonSection />

      {/* 5. Bottom Conversion CTA */}
      <BottomCtaSection />

      {/* 6. Multi-Column Footer + Language Switcher */}
      <LandingFooter />
    </div>
  );
}
