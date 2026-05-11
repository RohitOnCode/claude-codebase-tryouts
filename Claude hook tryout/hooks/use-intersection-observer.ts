import { signal, inject, DestroyRef, afterNextRender, ElementRef } from '@angular/core';

/**
 * Tracks whether the host element is visible in the viewport.
 * Must be called inside a component's constructor/field initializer.
 * Useful for lazy rendering, infinite scroll, and animation triggers.
 *
 * Usage (inside a component):
 *   readonly isVisible = useIntersectionObserver();
 *   // Template: @if (isVisible()) { <heavy-chart /> }
 *
 * Optional: pass IntersectionObserver options for threshold / rootMargin.
 */
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const isVisible = signal(false);
  const elementRef = inject(ElementRef) as ElementRef<Element>;
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.set(entry.isIntersecting);
    }, options);

    observer.observe(elementRef.nativeElement);
    destroyRef.onDestroy(() => observer.disconnect());
  });

  return isVisible.asReadonly();
}
