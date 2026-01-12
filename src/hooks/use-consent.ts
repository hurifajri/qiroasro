'use client';

import { useCallback, useEffect, useState } from 'react';
import { CONSENT_STORAGE_KEY } from '@/lib/constants';

type ConsentStatus = 'granted' | 'denied' | null;

interface UseConsentReturn {
  /** null = not yet chosen, true = accepted, false = rejected */
  hasConsented: boolean | null;
  /** Accept analytics tracking */
  acceptConsent: () => void;
  /** Reject analytics tracking */
  rejectConsent: () => void;
  /** Reset consent (show banner again) */
  resetConsent: () => void;
}

function getStoredConsent(): ConsentStatus {
  if (window === undefined) return null;

  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === 'granted') return 'granted';
  if (stored === 'denied') return 'denied';

  return null;
}

function setStoredConsent(status: ConsentStatus) {
  if (window === undefined) return;

  if (status === null) {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } else {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  }
}

/**
 * Hook to manage analytics consent state.
 * Persists to localStorage.
 */
export function useConsent(): UseConsentReturn {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setConsentStatus(getStoredConsent());
    setIsHydrated(true);
  }, []);

  const acceptConsent = useCallback(() => {
    setStoredConsent('granted');
    setConsentStatus('granted');
  }, []);

  const rejectConsent = useCallback(() => {
    setStoredConsent('denied');
    setConsentStatus('denied');
  }, []);

  const resetConsent = useCallback(() => {
    setStoredConsent(null);
    setConsentStatus(null);
  }, []);

  // Convert to boolean | null for cleaner API
  const hasConsented =
    !isHydrated || consentStatus === null ? null : consentStatus === 'granted';

  return {
    hasConsented,
    acceptConsent,
    rejectConsent,
    resetConsent,
  };
}
