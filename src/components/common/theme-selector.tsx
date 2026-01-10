'use client';

import type { ColorMode } from '@xyflow/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGlobalStore } from '@/providers/global';

type ThemeSelectorProps = Readonly<{
  theme: ColorMode;
}>;

export function ThemeSelector({ theme }: ThemeSelectorProps) {
  const router = useRouter();
  const setTheme = useGlobalStore((s) => s.setTheme);
  const storeTheme = useGlobalStore((s) => s.theme);

  // Use store value (client) after hydration, fallback to server prop
  const currentTheme = storeTheme ?? theme;

  const handleThemeChange = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Refresh to re-render server components with new theme from cookies
    router.refresh();
  };

  return (
    <Button
      id="tour-theme-selector"
      className="rounded-full text-muted-foreground"
      onClick={handleThemeChange}
      size="icon"
      variant="outline"
    >
      {currentTheme === 'light' ? (
        <SunIcon className="size-5" />
      ) : (
        <MoonIcon className="size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
