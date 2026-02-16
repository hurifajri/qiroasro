'use client';

import { useEffect } from 'react';
import { useGlobalStore } from '@/providers/global';

/**
 * Client component to sync system theme preference with HTML element
 * when user selects 'system' theme mode
 */
export function SystemThemeScript() {
  const theme = useGlobalStore((s) => s.theme);

  useEffect(() => {
    if (theme !== 'system') return;

    const updateTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolvedTheme = isDark ? 'dark' : 'light';

      document.documentElement.className = resolvedTheme;
      document.documentElement.style.colorScheme = resolvedTheme;
    };

    // Initial update
    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, [theme]);

  return null;
}
