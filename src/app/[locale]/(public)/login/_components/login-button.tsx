'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { GoogleIcon } from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth';

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
      await signIn('google');
      // Supabase OAuth redirect will handle the rest, but if it doesn't redirect fast:
      // it might stay in loading state, which is fine
    } catch (error) {
      console.error('Login error:', error);
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
        <div className="flex gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">{errorTitle}</p>
            <p className="text-destructive/90">{errorDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
