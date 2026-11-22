'use client';

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
import { type ReactNode, useRef } from 'react';

import { NodeButton } from '@/components/common/node-button';
import {
  ArticulationAreaNodeShell,
  ArticulationPointNodeShell,
  LetterNodeShell,
  TraitNodeShell,
} from '@/components/graph/tajweed-node';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { LOCALE_CONFIG } from '@/i18n/config';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

function HeroGraphShowcase() {
  const tHome = useTranslations('home_page.hero');
  const tGlobal = useTranslations('global');

  return (
    <Card className="w-full max-w-md border border-node-articulation/30 bg-linear-to-br from-node-articulation-secondary/45 via-card to-node-trait-secondary/45 shadow-md">
      <CardHeader className="border-b border-border/60 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold text-foreground">
            {tHome('preview_title')}
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-node-letter-tafkhim/15 text-node-letter-tafkhim"
          >
            {tGlobal('trait.tafkhim')}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {tHome('preview_citation')}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 pt-2 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ArticulationAreaNodeShell
            label={tGlobal('articulation_area.al_lisan')}
            className="px-4 py-2 text-xs"
          />
          <ArticulationPointNodeShell
            label={tGlobal('articulation_point.hafah_lisan_adhras')}
            className="px-3 py-1.5"
          />
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 260 36"
          className="h-8 w-60 overflow-visible"
        >
          <path
            d="M 65 2 C 65 20, 130 14, 130 34"
            fill="none"
            stroke="var(--color-node-articulation)"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <path
            d="M 195 2 C 195 20, 130 14, 130 34"
            fill="none"
            stroke="var(--color-node-trait)"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
        </svg>

        <LetterNodeShell
          symbol="ض"
          label={`(${tGlobal('letter.dhad')})`}
          tafkhimType="always_tafkhim"
          className="shadow-md"
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <TraitNodeShell label={tGlobal('trait.jahr')} className="px-3 py-1" />
          <TraitNodeShell
            label={tGlobal('trait.istila')}
            className="px-3 py-1"
          />
          <TraitNodeShell
            label={tGlobal('trait.itbaq')}
            className="px-3 py-1"
          />
          <TraitNodeShell
            label={tGlobal('trait.istithalah')}
            className="px-3 py-1"
          />
          <TraitNodeShell
            label={tGlobal('trait.tafkhim')}
            isDashed
            className="px-3 py-1"
          />
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-border/60 bg-muted/40 py-3">
        <p
          lang="ar"
          dir="rtl"
          className="text-center font-arabic text-base leading-loose text-foreground"
        >
          وَالضَّادُ: مِنْ حَافَتِهِ إِذْ وَلِيَا ✽ لَاضْرَاسَ مِنْ أَيْسَرَ أَوْ يُمْنَاهَا
        </p>
      </CardFooter>
    </Card>
  );
}

const MAKHARIJ_MODULES = [
  {
    key: 'al_jauf',
    symbol: 'ا و ي',
    badgeClass: 'bg-node-articulation text-node-letter-text',
  },
  {
    key: 'al_halq',
    symbol: 'ء هـ ع ح غ خ',
    badgeClass: 'bg-node-letter text-node-letter-text',
  },
  {
    key: 'al_lisan',
    symbol: 'ق ك ج ش ض',
    badgeClass: 'bg-node-letter-tafkhim text-node-letter-text',
  },
  {
    key: 'asy_syafatain',
    symbol: 'ف ب م و',
    badgeClass: 'bg-node-letter-conditional text-node-letter-text',
  },
  {
    key: 'al_khaisyum',
    symbol: 'ن م',
    badgeClass: 'bg-node-trait text-node-letter-text',
  },
  {
    key: 'sifatul_huruf',
    symbol: 'قلقلة',
    badgeClass: 'bg-primary text-primary-foreground',
  },
  {
    key: 'hijaiyyah_29',
    symbol: '٢٩',
    badgeClass: 'bg-node-letter-dark text-node-letter-text',
  },
  {
    key: 'matan_klasik',
    symbol: '٤',
    badgeClass: 'bg-node-articulation-dark text-node-letter-text',
  },
] as const;

function MakharijNavigationBar() {
  const t = useTranslations('home_page.nav_bar');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleScroll(direction: number) {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: direction * 260, behavior: 'smooth' });
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
          className="flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {MAKHARIJ_MODULES.map((item) => (
            <Button
              key={item.key}
              variant="ghost"
              size="sm"
              asChild
              className="h-auto shrink-0 gap-2.5 rounded-xl px-3 py-1.5"
            >
              <Link href="/playground">
                <span
                  className={cn(
                    'inline-flex h-7 min-w-9 items-center justify-center rounded-lg px-2 font-arabic text-xs font-bold shadow-xs',
                    item.badgeClass,
                  )}
                >
                  {item.symbol}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {t(`items.${item.key}`)}
                </span>
              </Link>
            </Button>
          ))}
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
      {/* 1. Hero Split Section */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:gap-14 lg:py-20">
        <m.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="flex w-full flex-1 justify-center"
        >
          <HeroGraphShowcase />
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
            {t('hero.badge')}
          </Badge>

          <h2 className="max-w-lg text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t('hero.title')}
          </h2>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            {t('hero.subtitle')}
          </p>

          <div className="flex w-full max-w-sm flex-col gap-3 pt-1">
            <Button size="lg" asChild className="h-12 text-sm font-bold">
              <Link href="/login">{t('hero.cta_login')}</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 text-sm font-bold"
            >
              <Link href="/playground">{t('hero.cta_playground')}</Link>
            </Button>
          </div>
        </m.div>
      </section>

      {/* 2. Makharij & Curriculum Navigation Bar */}
      <MakharijNavigationBar />

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
