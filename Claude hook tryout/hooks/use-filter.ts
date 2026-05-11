import { signal, computed } from '@angular/core';

export interface FilterState<T, F extends Record<string, unknown>> {
  filteredItems: () => T[];
  filters: () => Partial<F>;
  setFilter: <K extends keyof F>(key: K, value: F[K] | undefined) => void;
  clearFilter: (key: keyof F) => void;
  clearAllFilters: () => void;
  activeFilterCount: () => number;
}

/**
 * Generic multi-key filter over any array signal.
 * Provide a predicate that decides whether an item matches the current filters.
 *
 * Usage (IT PM App task board):
 *   interface TaskFilters { status: TaskStatus; priority: Priority; assigneeId: string }
 *   const filter = useFilter(tasks, (task, f) =>
 *     (!f.status     || task.status     === f.status)     &&
 *     (!f.priority   || task.priority   === f.priority)   &&
 *     (!f.assigneeId || task.assigneeId === f.assigneeId)
 *   );
 *   filter.setFilter('status', 'in-progress');
 *   // Template: *ngFor="let t of filter.filteredItems()"
 */
export function useFilter<T, F extends Record<string, unknown>>(
  items: () => T[],
  predicate: (item: T, filters: Partial<F>) => boolean
): FilterState<T, F> {
  const filters = signal<Partial<F>>({});

  const filteredItems = computed(() => {
    const f = filters();
    const hasFilters = Object.values(f).some((v) => v !== undefined && v !== null && v !== '');
    return hasFilters ? items().filter((item) => predicate(item, f)) : items();
  });

  const activeFilterCount = computed(
    () => Object.values(filters()).filter((v) => v !== undefined && v !== null && v !== '').length
  );

  function setFilter<K extends keyof F>(key: K, value: F[K] | undefined) {
    filters.update((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilter(key: keyof F) {
    filters.update((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function clearAllFilters() {
    filters.set({});
  }

  return {
    filteredItems,
    filters: filters.asReadonly(),
    setFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount,
  };
}
