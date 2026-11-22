import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {
  /* static client hydration check */
};

/**
 * Returns true after the component has mounted on the client.
 * Useful for avoiding hydration mismatches when using client-side only features.
 *
 * @example
 * ```tsx
 * const { isMounted } = useMounted();
 *
 * if (!isMounted) {
 *   return null; // or loading skeleton
 * }
 *
 * return <ClientOnlyContent />;
 * ```
 */
export function useMounted() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return { isMounted };
}
