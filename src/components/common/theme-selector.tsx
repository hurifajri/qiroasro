'use client';

import type { ColorMode } from '@xyflow/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/providers/global';

type ThemeSelectorProps = Readonly<{
  theme: ColorMode;
}>;

export function ThemeSelector({ theme }: ThemeSelectorProps) {
  const setTheme = useGlobalStore((s) => s.setTheme);

  return (
    <Button
      id="tour-theme-selector"
      className="rounded-full text-muted-foreground"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      size="icon"
      variant="outline"
    >
      {theme === 'light' ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
