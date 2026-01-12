/**
 * Lightweight mobile device detection using User Agent regex.
 * Zero dependencies, ~200 bytes gzipped.
 */
export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
