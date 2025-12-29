'use client';

import { type Driver, type DriveStep, driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';

const TOUR_STORAGE_KEY = 'playground-tour-completed';

export function usePlaygroundTour() {
  const t = useTranslations('playground_page.tour');
  const driverRef = useRef<Driver | null>(null);

  // Helper to check if an element is visible in DOM
  const isElementVisible = useCallback((selector: string): boolean => {
    const element = document.querySelector(selector);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }, []);

  // Helper to apply eye-catching highlight effect
  const flashElement = useCallback((element: Element | null) => {
    if (!element) return;

    // const el = element.parentElement as HTMLElement;
    const el = element as HTMLElement;
    if (!el) return;
    const originalStyles = {
      borderRadius: el.style.borderRadius,
      border: el.style.border,
    };

    // Apply red highlight with border radius
    el.style.borderRadius = '4px';
    el.style.border = '1px solid red';

    // Reset after 1.5 seconds
    setTimeout(() => {
      el.style.borderRadius = originalStyles.borderRadius;
      el.style.border = originalStyles.border;
    }, 500);
  }, []);

  const getTourSteps = useCallback((): DriveStep[] => {
    return [
      {
        popover: {
          title: t('steps.welcome.title'),
          description: t('steps.welcome.description'),
        },
      },
      {
        element: '#tour-canvas',
        popover: {
          title: t('steps.canvas.title'),
          description: t('steps.canvas.description'),
        },
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
          onNextClick: () => {
            // Check if settings panel content is visible (user has opened it)
            if (!isElementVisible('#tour-view-mode')) {
              // Flash the trigger to indicate user needs to click it
              const trigger = document.querySelector('#tour-graph-filter');
              flashElement(trigger);
              return;
            }
            driverRef.current?.moveNext();
          },
        },
      },
      {
        element: '#tour-view-mode',
        popover: {
          title: t('steps.view_mode.title'),
          description: t('steps.view_mode.description'),
          onNextClick: () => {
            // Check if settings panel content is visible (user has opened it)
            if (!isElementVisible('#tour-letter-selector')) {
              // Flash the trigger to indicate user needs to click it
              const buttons = document.querySelectorAll('#tour-view-mode button');
              const trigger = buttons[buttons.length - 1];
              flashElement(trigger);
              return;
            }
            driverRef.current?.moveNext();
          },
        },
      },
      {
        element: '#tour-letter-selector',
        popover: {
          title: t('steps.letter_selector.title'),
          description: t('steps.letter_selector.description'),
        },
      },
      {
        element: '#tour-layout-mode',
        popover: {
          title: t('steps.layout_mode.title'),
          description: t('steps.layout_mode.description'),
          onNextClick: () => {
            // Check if settings panel content is visible (user has opened it)
            if (!isElementVisible('#tour-hierarchy-direction')) {
              // Flash the trigger to indicate user needs to click it
              const buttons = document.querySelectorAll('#tour-layout-mode button');
              const trigger = buttons[buttons.length - 1];
              flashElement(trigger);
              return;
            }
            driverRef.current?.moveNext();
          },
        },
      },
      {
        element: '#tour-hierarchy-direction',
        popover: {
          title: t('steps.hierarchy_direction.title'),
          description: t('steps.hierarchy_direction.description'),
          onNextClick: () => {
            const buttons = document.querySelectorAll('#tour-hierarchy-direction button');
            const lastButton = buttons[buttons.length - 1];

            // Check if last button (Horizontal) is active by checking for active styling class
            const isLastButtonActive =
              lastButton?.classList.contains('from-amber-500') ||
              lastButton?.className.includes('from-amber-500');

            if (!isLastButtonActive) {
              // Flash the trigger to indicate user needs to click it
              flashElement(lastButton);
              return;
            }
            driverRef.current?.moveNext();
          },
        },
      },
      {
        element: '#tour-edge-style',
        popover: {
          title: t('steps.edge_style.title'),
          description: t('steps.edge_style.description'),
          onNextClick: () => {
            // Check if settings panel content is visible (user has opened it)
            if (!isElementVisible('#tour-edge-shape')) {
              // Flash the trigger to indicate user needs to click it
              const trigger = document.querySelector('#tour-edge-style button');
              flashElement(trigger);
              return;
            }
            driverRef.current?.moveNext();
          },
        },
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
          onNextClick: () => {
            // Check if legend content is visible (user has opened it)
            if (!isElementVisible('#tour-legend-detail')) {
              // Flash the trigger to indicate user needs to click it
              const trigger = document.querySelector('#tour-graph-legend');
              flashElement(trigger);
              return;
            }
            driverRef.current?.moveNext();
          },
        },
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
        element: '#tour-locale-selector',
        popover: {
          title: t('steps.locale_selector.title'),
          description: t('steps.locale_selector.description'),
        },
      },
      {
        element: '#tour-theme-selector',
        popover: {
          title: t('steps.theme_selector.title'),
          description: t('steps.theme_selector.description'),
        },
      },
      {
        element: '#tour-waitlist-button',
        popover: {
          title: t('steps.waitlist_button.title'),
          description: t('steps.waitlist_button.description'),
        },
      },
      {
        popover: {
          title: t('steps.end.title'),
          description: t('steps.end.description'),
        },
      },
    ];
  }, [t, isElementVisible, flashElement]);

  const startTour = useCallback(() => {
    // Destroy existing driver if any
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const driverInstance = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      stagePadding: 8,
      stageRadius: 8,
      nextBtnText: t('next'),
      prevBtnText: t('prev'),
      doneBtnText: t('done'),
      popoverClass: 'driverjs-theme',
      steps: getTourSteps(),
      onDestroyed: () => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      },
    });

    driverRef.current = driverInstance;
    driverInstance.drive();
  }, [t, getTourSteps]);

  // Auto-start tour on first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasSeenTour) {
      // Small delay to ensure elements are rendered
      const timer = setTimeout(() => {
        startTour();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [startTour]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);

  return { startTour };
}
