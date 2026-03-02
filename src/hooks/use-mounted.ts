import { useEffect, useState } from 'react';

/**
 * Returns true after the component has mounted on the client.
 * Useful for avoiding hydration mismatches when using client-side only features.
 *
 * @example
 * ```tsx
 * const isMounted = useIsMounted();
 *
 * if (!isMounted) {
 *   return null; // or loading skeleton
 * }
 *
 * return <ClientOnlyContent />;
 * ```
 */
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted };
}
