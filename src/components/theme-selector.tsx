'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/providers/global';
import type { Theme } from '@/stores/global';

type ThemeSelectorProps = Readonly<{
  theme: Theme;
}>;

export function ThemeSelector({ theme }: ThemeSelectorProps) {
  const { setTheme } = useGlobalStore((state) => state);

  return (
    <Button
      className="rounded-full"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      size="icon"
      variant="outline"
    >
      {theme === 'light' ? (
        <SunIcon className="size-5" />
      ) : (
        <MoonIcon className="size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
