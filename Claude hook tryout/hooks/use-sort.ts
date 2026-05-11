import { signal, computed } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortState<T> {
  sortedItems: () => T[];
  sortKey: () => keyof T | null;
  sortDirection: () => SortDirection;
  sortBy: (key: keyof T) => void;
  clearSort: () => void;
}

/**
 * Adds sortable state to any array signal.
 * Clicking the same key toggles asc → desc → none.
 *
 * Usage:
 *   const tasks = signal<Task[]>([...]);
 *   const sort = useSort(tasks);
 *   sort.sortBy('priority');
 *   // Template: *ngFor="let t of sort.sortedItems()"
 *   //           (click)="sort.sortBy('title')"
 */
export function useSort<T extends Record<string, unknown>>(
  items: () => T[]
): SortState<T> {
  const sortKey = signal<keyof T | null>(null);
  const sortDirection = signal<SortDirection>('none');

  const sortedItems = computed(() => {
    const key = sortKey();
    const dir = sortDirection();

    if (!key || dir === 'none') return items();

    return [...items()].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const result = aVal < bVal ? -1 : 1;
      return dir === 'asc' ? result : -result;
    });
  });

  function sortBy(key: keyof T) {
    if (sortKey() !== key) {
      sortKey.set(key);
      sortDirection.set('asc');
    } else {
      // cycle: asc → desc → none
      const cycle: Record<SortDirection, SortDirection> = {
        asc: 'desc',
        desc: 'none',
        none: 'asc',
      };
      sortDirection.update((d) => cycle[d]);
      if (sortDirection() === 'none') sortKey.set(null);
    }
  }

  function clearSort() {
    sortKey.set(null);
    sortDirection.set('none');
  }

  return {
    sortedItems,
    sortKey: sortKey.asReadonly(),
    sortDirection: sortDirection.asReadonly(),
    sortBy,
    clearSort,
  };
}
