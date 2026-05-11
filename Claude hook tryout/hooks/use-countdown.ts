import { signal, computed, effect, inject, DestroyRef } from '@angular/core';

export interface CountdownResult {
  days: () => number;
  hours: () => number;
  minutes: () => number;
  seconds: () => number;
  totalSecondsLeft: () => number;
  isExpired: () => boolean;
  formatted: () => string;
}

/**
 * Counts down to a target date, updating every second.
 * Perfect for sprint end-date countdowns in the IT PM app.
 *
 * Usage:
 *   const sprint = useCountdown(new Date('2025-06-30'));
 *   // Template: {{ sprint.formatted() }}   →  "4d 12h 30m 05s"
 *   //           @if (sprint.isExpired()) { Sprint ended! }
 */
export function useCountdown(targetDate: Date): CountdownResult {
  const destroyRef = inject(DestroyRef);
  const now = signal(Date.now());

  const intervalId = setInterval(() => now.set(Date.now()), 1000);
  destroyRef.onDestroy(() => clearInterval(intervalId));

  const totalSecondsLeft = computed(() =>
    Math.max(0, Math.floor((targetDate.getTime() - now()) / 1000))
  );

  const days = computed(() => Math.floor(totalSecondsLeft() / 86400));
  const hours = computed(() => Math.floor((totalSecondsLeft() % 86400) / 3600));
  const minutes = computed(() => Math.floor((totalSecondsLeft() % 3600) / 60));
  const seconds = computed(() => totalSecondsLeft() % 60);
  const isExpired = computed(() => totalSecondsLeft() === 0);

  const formatted = computed(() => {
    if (isExpired()) return 'Expired';
    const pad = (n: number) => String(n).padStart(2, '0');
    return days() > 0
      ? `${days()}d ${pad(hours())}h ${pad(minutes())}m ${pad(seconds())}s`
      : `${pad(hours())}h ${pad(minutes())}m ${pad(seconds())}s`;
  });

  return { days, hours, minutes, seconds, totalSecondsLeft, isExpired, formatted };
}
