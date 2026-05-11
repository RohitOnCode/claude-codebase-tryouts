import { signal, inject, DestroyRef, afterNextRender } from '@angular/core';

/**
 * Tracks whether a CSS media query matches.
 * Returns a readonly signal that stays in sync with the viewport.
 *
 * Usage:
 *   const isMobile   = useMediaQuery('(max-width: 639px)');
 *   const isDark     = useMediaQuery('(prefers-color-scheme: dark)');
 *   const isTablet   = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
 *
 * Tailwind breakpoint helpers are exported below for convenience.
 */
export function useMediaQuery(query: string) {
  const matches = signal(false);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    const mql = window.matchMedia(query);
    matches.set(mql.matches);

    const handler = (e: MediaQueryListEvent) => matches.set(e.matches);
    mql.addEventListener('change', handler);
    destroyRef.onDestroy(() => mql.removeEventListener('change', handler));
  });

  return matches.asReadonly();
}

// --- Tailwind-aligned breakpoint helpers ---

/** < 640px */
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');

/** ≥ 640px */
export const useIsSm = () => useMediaQuery('(min-width: 640px)');

/** ≥ 768px */
export const useIsMd = () => useMediaQuery('(min-width: 768px)');

/** ≥ 1024px */
export const useIsLg = () => useMediaQuery('(min-width: 1024px)');

/** ≥ 1280px */
export const useIsXl = () => useMediaQuery('(min-width: 1280px)');
