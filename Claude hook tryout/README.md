# Angular Hooks Library

A collection of **functional composables** for Angular 17+ using the latest Signals API.
These are inspired by the React hooks pattern, adapted for Angular's DI and reactivity model.

Copy any hook file into your project's `src/app/core/hooks/` folder and import directly.

---

## The Hook Pattern

Angular hooks are plain **functions** that:
- Use `inject()` internally to access DI (no constructor needed)
- Return reactive **signals** (`signal`, `computed`)
- Clean up after themselves via `DestroyRef`
- Must be called inside a component/directive **constructor** or class **field initializer**

```typescript
// Calling a hook inside a component
@Component({ ... })
export class TaskBoardComponent {
  private tasks = inject(TaskService).tasks;

  // Hooks are called here — at field-initialization time
  search = signal('');
  debouncedSearch = useDebounce(this.search, 400);
  sort = useSort(this.tasks);
  pagination = usePagination(this.sort.sortedItems, 10);
}
```

---

## Available Hooks

### `useDebounce(source, delayMs?)`
Delays propagating a signal's value until the user stops changing it.

```typescript
const search = signal('');
const debouncedSearch = useDebounce(search, 400);
// use debouncedSearch() in a computed() to filter lists
```
**IT PM app use cases:** search bar in Projects list, Task board, Bug tracker.

---

### `usePagination(items, pageSize?)`
Full pagination state over any array signal — page controls, sliced data, page numbers.

```typescript
const pagination = usePagination(tasks, 10);
// Template
// *ngFor="let task of pagination.paginatedItems()"
// (click)="pagination.goToPage(3)"
// (click)="pagination.nextPage()"
```
**IT PM app use cases:** Projects list, Team list, Bug tracker table.

---

### `useLocalStorage(key, defaultValue)`
Persists a signal to `localStorage`. Rehydrates automatically. SSR-safe.

```typescript
const sidebarOpen = useLocalStorage('sidebar-open', true);
const theme = useLocalStorage<'light' | 'dark'>('theme', 'light');
sidebarOpen.set(false); // automatically saved
```
**IT PM app use cases:** sidebar collapsed state, active theme, last-viewed project ID.

---

### `useMediaQuery(query)` + breakpoint helpers
Tracks a CSS media query, returning a boolean signal that updates on resize.

```typescript
const isMobile = useIsMobile();     // < 640px
const isDesktop = useIsLg();        // ≥ 1024px
// Template: @if (!isMobile()) { <sidebar /> }
```
**IT PM app use cases:** responsive sidebar, mobile task card layout, column count.

---

### `useLoading<T>()`
Manages `loading / success / error` state for any async operation.

```typescript
const loader = useLoading<Project[]>();
await loader.run(() => fetch('/api/projects').then(r => r.json()));
// Template:
// @if (loader.isLoading()) { <spinner /> }
// @if (loader.isError())   { {{ loader.error() }} }
// @for (p of loader.data()) { <project-card [project]="p" /> }
```
**IT PM app use cases:** wrap any future HTTP service call in services.

---

### `useSort(items)`
Adds sortable state; clicking the same column cycles `asc → desc → none`.

```typescript
const sort = useSort(tasks);
sort.sortBy('priority');
// Template:
// *ngFor="let t of sort.sortedItems()"
// (click)="sort.sortBy('title')"
// [class.active]="sort.sortKey() === 'title'"
```
**IT PM app use cases:** Bug tracker table, Team list, Project list sorting.

---

### `useFilter(items, predicate)`
Multi-key filter with active filter count badge.

```typescript
interface TaskFilters { status: TaskStatus; priority: Priority }

const filter = useFilter(tasks, (task, f) =>
  (!f.status   || task.status   === f.status) &&
  (!f.priority || task.priority === f.priority)
);
filter.setFilter('status', 'in-progress');
filter.clearAllFilters();
// Template: {{ filter.activeFilterCount() }} active filters
```
**IT PM app use cases:** Task board filters, Bug severity filter, Project status filter.

---

### `useCountdown(targetDate)`
Live countdown to a date, updating every second. Perfect for sprint timers.

```typescript
const sprintEnd = useCountdown(new Date(sprint.endDate));
// Template: {{ sprintEnd.formatted() }}  →  "4d 12h 30m 05s"
// @if (sprintEnd.isExpired()) { Sprint has ended! }
```
**IT PM app use cases:** Active sprint countdown widget on the Dashboard.

---

### `useClipboard(resetMs?)`
Copies text, shows a brief "copied!" state for `resetMs` ms (default 2s).

```typescript
const clipboard = useClipboard();
// Template:
// (click)="clipboard.copy(task.id)"
// [class.text-green-500]="clipboard.copied()"
// {{ clipboard.copied() ? 'Copied!' : 'Copy ID' }}
```
**IT PM app use cases:** Copy task/bug ID, copy repository URL in Project Detail.

---

### `useIntersectionObserver(options?)`
Returns true when the host element enters the viewport. Calls `inject(ElementRef)` automatically.

```typescript
@Component({ ... })
export class ProjectVelocityWidget {
  isVisible = useIntersectionObserver({ threshold: 0.3 });
  // Template: @if (isVisible()) { <chart /> }
}
```
**IT PM app use cases:** Lazy-render chart widgets on Dashboard, animate cards on scroll.

---

## Composing Hooks

Hooks compose naturally — pass the output of one as input to another:

```typescript
export class BugTrackerComponent {
  private bugs = inject(BugService).bugs;

  search = signal('');
  debouncedSearch = useDebounce(this.search, 300);

  filtered = useFilter(this.bugs, (bug, f) =>
    (!f.search || bug.title.toLowerCase().includes(f.search.toLowerCase()))
  );

  sorted = useSort(this.filtered.filteredItems);
  paginated = usePagination(this.sorted.sortedItems, 15);
}
```

---

## Installation

1. Copy the `hooks/` folder into `src/app/core/hooks/`
2. Import from the barrel: `import { useDebounce, usePagination } from '../core/hooks'`
3. No additional packages required — only `@angular/core` APIs are used
