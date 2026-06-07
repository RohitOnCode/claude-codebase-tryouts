---
description: Apply or troubleshoot Tailwind CSS utility classes and the project's shared component styles. Use when styling Angular templates, debugging classes that don't apply, or extending the design system.
---

# Tailwind CSS Helper

Generic guidance for working with Tailwind in this Angular project.

## Where things live

- `tailwind.config.js` — `content` globs (`./src/**/*.{html,ts}`), theme
  extensions (e.g. the `primary` color palette), and plugins.
- `src/styles.css` — `@tailwind base/components/utilities` directives plus a
  `@layer components` block defining reusable classes:
  `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`, `.card`,
  `.form-input`, `.form-label`, `.badge` + `.badge-{color}`, `.table-header`, `.table-cell`.

## Guidance

- **Prefer the shared `@layer components` classes** over repeating long utility
  chains in templates — if you find yourself writing the same Tailwind
  combination in 3+ places, promote it to `styles.css`.
- **Classes not applying?** Check that the file is covered by `content` in
  `tailwind.config.js` (it globs `src/**/*.{html,ts}` — new folders under `src/app`
  are covered automatically, but files outside `src/` are not).
- **Dynamic classes**: Tailwind can't see classes built via string concatenation
  at runtime (e.g. `` `bg-${color}-500` ``) — use a lookup map returning full
  class names instead (see `getStatusClass()` patterns in `ClaimsComponent`/`InvoicesComponent`).
- **Responsive/state variants**: use Tailwind prefixes directly in templates —
  `sm:`, `lg:`, `hover:`, `focus:`, `disabled:` — rather than custom CSS media queries.
- **Extending the theme**: add new colors/spacing under `theme.extend` in
  `tailwind.config.js` rather than overriding Tailwind's defaults.

## Quick checks

- Rebuild and look for unexpectedly unstyled elements:
  `ng build --configuration=development`
- If a utility class seems to have no effect, confirm it's a real Tailwind class
  (typos silently produce no styles — Tailwind doesn't error on unknown classes).
