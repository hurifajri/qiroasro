'use client';

import type { ColorMode } from '@xyflow/react';
import type { Driver, DriveStep } from 'driver.js';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';

import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

const TOUR_COMPLETED_KEY = 'playground_tour-completed';

function hasCompletedTour(): boolean {
  try {
    return Boolean(localStorage.getItem(TOUR_COMPLETED_KEY));
  } catch (error) {
    console.warn('[usePlaygroundTour] Failed to read localStorage:', error);
    return false;
  }
}

function markTourCompleted(): void {
  try {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  } catch (error) {
    console.warn('[usePlaygroundTour] Failed to write localStorage:', error);
  }
}

interface UsePlaygroundTourProps {
  theme: ColorMode;
  onBeforeStart?: () => void;
}

export function usePlaygroundTour({
  theme,
  onBeforeStart,
}: UsePlaygroundTourProps) {
  const t = useTranslations('playground_page.tour');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const driverRef = useRef<Driver | null>(null);
  const onBeforeStartRef = useRef(onBeforeStart);

  useEffect(() => {
    onBeforeStartRef.current = onBeforeStart;
  }, [onBeforeStart]);

  const getTourSteps = useCallback((): DriveStep[] => {
    return [
      {
        popover: {
          title: t('steps.welcome.title'),
          description: t('steps.welcome.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-locale-selector',
        popover: {
          title: t('steps.locale_selector.title'),
          description: t('steps.locale_selector.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-theme-selector',
        popover: {
          title: t('steps.theme_selector.title'),
          description: t('steps.theme_selector.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-canvas',
        popover: {
          title: t('steps.canvas.title'),
          description: t('steps.canvas.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-controls',
        popover: {
          title: t('steps.controls.title'),
          description: t('steps.controls.description'),
        },
      },
      {
        element: '#tour-graph-filter',
        popover: {
          title: t('steps.graph_filter.title'),
          description: t('steps.graph_filter.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-view-mode',
        popover: {
          title: t('steps.view_mode.title'),
          description: t('steps.view_mode.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-letter-selector',
        popover: {
          title: t('steps.letter_selector.title'),
          description: t('steps.letter_selector.description'),
        },
      },
      {
        element: '#tour-visibility-filter',
        popover: {
          title: t('steps.visibility_filter.title'),
          description: t('steps.visibility_filter.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-layout-mode',
        popover: {
          title: t('steps.layout_mode.title'),
          description: t('steps.layout_mode.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-hierarchy-direction',
        popover: {
          title: t('steps.hierarchy_direction.title'),
          description: t('steps.hierarchy_direction.description'),
        },
      },
      {
        element: '#tour-edge-style',
        popover: {
          title: t('steps.edge_style.title'),
          description: t('steps.edge_style.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-edge-shape',
        popover: {
          title: t('steps.edge_shape.title'),
          description: t('steps.edge_shape.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-graph-legend',
        popover: {
          title: t('steps.graph_legend.title'),
          description: t('steps.graph_legend.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-legend-detail',
        popover: {
          title: t('steps.legend_detail.title'),
          description: t('steps.legend_detail.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-quiz',
        popover: {
          title: t('steps.quiz.title'),
          description: t('steps.quiz.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-download-image',
        popover: {
          title: t('steps.download.title'),
          description: t('steps.download.description'),
        },
        disableActiveInteraction: true,
      },
      {
        element: '#tour-help',
        popover: {
          title: t('steps.help.title'),
          description: t('steps.help.description'),
        },
        disableActiveInteraction: true,
      },
      {
        popover: {
          title: t('steps.end.title'),
          description: t('steps.end.description'),
        },
        disableActiveInteraction: true,
      },
    ];
  }, [t]);

  const startTour = useCallback(async () => {
    // Destroy existing driver if any
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    onBeforeStartRef.current?.();

    // Lazy load driver.js and its CSS
    const [{ driver }] = await Promise.all([
      import('driver.js'),
      import('driver.js/dist/driver.css'),
    ]);

    // Wait for React to commit and paint any expanded panels / reset filter controls
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    const driverInstance = driver({
      showProgress: true,
      progressText: `{{current}} / {{total}}`,
      animate: true,
      allowClose: true,
      overlayClickBehavior: () => {
        // Prevent closing tour when clicking outside; user must use the close (X) button
      },
      stagePadding: 8,
      stageRadius: 8,
      nextBtnText: t('next'),
      prevBtnText: t('prev'),
      doneBtnText: t('done'),
      popoverClass: `driverjs-theme ${dir === 'rtl' ? 'driverjs-rtl' : ''}`,
      overlayColor: theme === 'dark' ? 'white' : 'black',
      steps: getTourSteps(),
      onDestroyStarted: () => {
        // Mark tour as completed when user finishes or dismisses
        markTourCompleted();
        driverRef.current?.destroy();
      },
    });

    driverRef.current = driverInstance;
    driverInstance.drive();
  }, [dir, getTourSteps, t, theme]);

  const startTourRef = useRef(startTour);

  useEffect(() => {
    startTourRef.current = startTour;
  }, [startTour]);

  // Auto-start tour on first visit
  useEffect(() => {
    if (hasCompletedTour()) return;

    // Delay to allow the graph to render before starting the tour
    const timeout = setTimeout(() => {
      startTourRef.current().catch((error) => {
        console.error('[usePlaygroundTour] Failed to start tour:', error);
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);

  return { startTour };
}
