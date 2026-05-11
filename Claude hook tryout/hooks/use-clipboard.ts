import { signal, inject, DestroyRef } from '@angular/core';

export interface ClipboardResult {
  copied: () => boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Copies text to the clipboard and briefly sets `copied` to true.
 * Useful for "Copy link" / "Copy ID" buttons.
 *
 * Usage:
 *   const clipboard = useClipboard();
 *   // Template: (click)="clipboard.copy(task.id)"
 *   //           [class.text-green-500]="clipboard.copied()"
 */
export function useClipboard(resetMs = 2000): ClipboardResult {
  const copied = signal(false);
  const destroyRef = inject(DestroyRef);
  let timer: ReturnType<typeof setTimeout>;

  destroyRef.onDestroy(() => clearTimeout(timer));

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied.set(true);
      clearTimeout(timer);
      timer = setTimeout(() => copied.set(false), resetMs);
    } catch {
      // clipboard API unavailable (non-HTTPS or denied)
    }
  }

  return { copied: copied.asReadonly(), copy };
}
