'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { GoogleIcon } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

interface LoginButtonProps {
  text: string;
  errorTitle: string;
  errorDesc: string;
}

export function LoginButton({ text, errorTitle, errorDesc }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(false);

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/home',
      });
    } catch {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        size="lg"
        variant="outline"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {text}
      </Button>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
          <AlertCircle className="shrink-0" />
          <div>
            <p className="font-semibold">{errorTitle}</p>
            <p className="text-destructive/90">{errorDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
