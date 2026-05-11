import { signal, computed } from '@angular/core';

export interface LoadingState<T> {
  data: () => T | null;
  error: () => string | null;
  isLoading: () => boolean;
  isSuccess: () => boolean;
  isError: () => boolean;
  run: (task: () => Promise<T>) => Promise<void>;
  reset: () => void;
}

/**
 * Manages loading / success / error state for any async operation.
 * Ideal for wrapping HTTP service calls.
 *
 * Usage:
 *   const loader = useLoading<Project[]>();
 *   await loader.run(() => projectService.fetchAll());
 *   // Template: @if (loader.isLoading()) { spinner }
 *   //           @if (loader.isError())   { loader.error() }
 *   //           @for (p of loader.data()) { ... }
 */
export function useLoading<T>(): LoadingState<T> {
  const data = signal<T | null>(null);
  const error = signal<string | null>(null);
  const isLoading = signal(false);

  const isSuccess = computed(() => !isLoading() && data() !== null && error() === null);
  const isError = computed(() => !isLoading() && error() !== null);

  async function run(task: () => Promise<T>) {
    isLoading.set(true);
    error.set(null);
    try {
      data.set(await task());
    } catch (e: unknown) {
      error.set(e instanceof Error ? e.message : 'An unexpected error occurred');
    } finally {
      isLoading.set(false);
    }
  }

  function reset() {
    data.set(null);
    error.set(null);
    isLoading.set(false);
  }

  return {
    data: data.asReadonly(),
    error: error.asReadonly(),
    isLoading: isLoading.asReadonly(),
    isSuccess,
    isError,
    run,
    reset,
  };
}
