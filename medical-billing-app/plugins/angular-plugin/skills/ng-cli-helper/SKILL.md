---
description: Run Angular CLI commands for serving, building, testing, and generating code. Use when the user wants to start the dev server, build, run tests, lint, or generate Angular artifacts.
---

# Angular CLI Helper

Generic helper for everyday `ng` / `npm` workflows. Run commands from the
Angular project root (the directory containing `angular.json`, e.g. `frontend/`).

## Common commands

- Start dev server: `npm start` (or `ng serve --port 4200`)
- Production build: `ng build --configuration=production`
- Dev build (faster, for smoke checks): `ng build --configuration=development`
- Run unit tests: `ng test`
- Run unit tests once (CI mode): `ng test --watch=false --browsers=ChromeHeadless`
- Lint: `ng lint` (if configured)
- Generate a component: `ng generate component components/<name> --module=app`
- Generate a service: `ng generate service services/<name>`

## Guidance

- Always run from the folder with `angular.json`, not the repo root.
- Prefer `ng build --configuration=development` over a full prod build when you
  just need to check for compile errors quickly — it's significantly faster.
- Template warnings like `NG8107` (redundant optional chaining) are not build
  failures; only `Application bundle generation complete` failing, or `ERROR`
  lines, indicate a real problem.
- After editing routing or module declarations, a full reload (not just HMR)
  may be required — restart `ng serve` if a new component doesn't appear.

Use `$ARGUMENTS` to pass through extra flags or sub-commands, e.g.
`/angular-plugin:ng-cli-helper test --include=**/patients*.spec.ts`.
