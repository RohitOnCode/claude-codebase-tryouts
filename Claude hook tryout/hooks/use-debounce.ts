import { signal, computed, effect, DestroyRef, inject } from '@angular/core';

/**
 * Returns a debounced version of the provided signal value.
 * The debounced value updates only after the specified delay has passed
 * without the source value changing.
 *
 * Usage:
 *   const search = signal('');
 *   const debouncedSearch = useDebounce(search, 400);
 *   // Use debouncedSearch() in templates or effects for filtering
 */
export function useDebounce<T>(source: () => T, delayMs = 300) {
  const debounced = signal<T>(source());
  const destroyRef = inject(DestroyRef);
  let timer: ReturnType<typeof setTimeout>;

  const cleanup = effect(() => {
    const value = source();
    clearTimeout(timer);
    timer = setTimeout(() => debounced.set(value), delayMs);
  });

  destroyRef.onDestroy(() => {
    clearTimeout(timer);
    cleanup.destroy();
  });

  return debounced.asReadonly();
}
