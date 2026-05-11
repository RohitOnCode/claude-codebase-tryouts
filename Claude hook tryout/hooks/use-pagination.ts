import { signal, computed } from '@angular/core';

export interface PaginationResult<T> {
  currentPage: () => number;
  pageSize: () => number;
  totalPages: () => number;
  totalItems: () => number;
  paginatedItems: () => T[];
  hasPrev: () => boolean;
  hasNext: () => boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  pageNumbers: () => number[];
}

/**
 * Provides full pagination state for any array signal.
 *
 * Usage:
 *   const tasks = signal<Task[]>([...]);
 *   const pagination = usePagination(tasks, 10);
 *   // In template: *ngFor="let t of pagination.paginatedItems()"
 *   // Navigate: pagination.nextPage() / pagination.goToPage(3)
 */
export function usePagination<T>(
  items: () => T[],
  initialPageSize = 10
): PaginationResult<T> {
  const currentPage = signal(1);
  const pageSize = signal(initialPageSize);

  const totalItems = computed(() => items().length);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems() / pageSize()))
  );

  const paginatedItems = computed(() => {
    const start = (currentPage() - 1) * pageSize();
    return items().slice(start, start + pageSize());
  });

  const hasPrev = computed(() => currentPage() > 1);
  const hasNext = computed(() => currentPage() < totalPages());

  // Page numbers array for rendering pagination controls
  const pageNumbers = computed(() =>
    Array.from({ length: totalPages() }, (_, i) => i + 1)
  );

  function goToPage(page: number) {
    const clamped = Math.max(1, Math.min(page, totalPages()));
    currentPage.set(clamped);
  }

  function nextPage() {
    if (hasNext()) currentPage.update((p) => p + 1);
  }

  function prevPage() {
    if (hasPrev()) currentPage.update((p) => p - 1);
  }

  function setPageSize(size: number) {
    pageSize.set(size);
    currentPage.set(1); // reset to first page when page size changes
  }

  return {
    currentPage: currentPage.asReadonly(),
    pageSize: pageSize.asReadonly(),
    totalPages,
    totalItems,
    paginatedItems,
    hasPrev,
    hasNext,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    pageNumbers,
  };
}
