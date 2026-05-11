import { signal, effect, inject, DestroyRef, afterNextRender } from '@angular/core';

/**
 * Persists a signal value to localStorage and rehydrates it on load.
 * Safe for SSR — reads/writes only after the first render.
 *
 * Usage:
 *   const theme = useLocalStorage<'light' | 'dark'>('app-theme', 'light');
 *   theme.set('dark');           // automatically persisted
 *   console.log(theme());        // reads from localStorage on next load
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = signal<T>(defaultValue);
  const destroyRef = inject(DestroyRef);

  // Read stored value after first render (SSR-safe)
  afterNextRender(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) stored.set(JSON.parse(raw) as T);
    } catch {
      // corrupted storage — fall back to default
    }
  });

  // Persist every change back to localStorage
  const persistEffect = effect(() => {
    try {
      const value = stored();
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage quota exceeded or unavailable — silently skip
    }
  });

  destroyRef.onDestroy(() => persistEffect.destroy());

  return stored;
}
