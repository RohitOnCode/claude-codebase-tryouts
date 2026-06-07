---
description: Scaffold a new Angular feature (model, service, component with ts/html/css, routing entry) following this project's conventions. Use when the user wants to add a new page or feature module to the Angular frontend.
---

# Angular Component Scaffolder

Generate a complete vertical slice for a new feature area, mirroring the
existing structure (`models/` → `services/` → `components/<feature>/`).
Use `$ARGUMENTS` as the feature name (e.g. `appointments`).

## Steps

1. **Model** (`models/<feature>.model.ts`)
   - Plain TypeScript `interface` matching the backend DTO/entity shape.
   - Make backend-generated fields (`id`, `createdAt`, etc.) optional with `?`.

2. **Service** (`services/<feature>.service.ts`)
   - `@Injectable({ providedIn: 'root' })`
   - Inject `HttpClient`, build `apiUrl` from `environment.apiUrl`
   - Standard methods: `getAll`, `getById`, `create`, `update`, `delete`
     returning `Observable<T>` / `Observable<T[]>`
   - Use `HttpParams` for optional query filters (see `PatientService.getAll`).

3. **Component** (`components/<feature>/<feature>.component.{ts,html,css}`)
   - `OnInit` with a `loading`/`error` pattern and a `loadX()` method that
     subscribes to the service (see `PatientsComponent` for the canonical shape).
   - Modal-based add/edit forms using `[(ngModel)]` two-way binding (this project
     uses `FormsModule`, not reactive forms).
   - Reuse the shared utility classes from `styles.css`: `.card`, `.btn-primary`,
     `.btn-secondary`, `.btn-danger`, `.form-input`, `.form-label`, `.badge-*`,
     `.table-header`, `.table-cell`.

4. **Routing** — register the component in `app-routing.module.ts` and add it to
   `declarations` in `app.module.ts`. Add a sidebar entry in
   `components/shared/sidebar/sidebar.component.ts` if it should be top-level navigation.

5. **Empty/loading/error states** — every list view should render a spinner while
   `loading`, an error banner on `error`, and a "No X found" row when the list is empty.

## Tailwind conventions

- Use utility classes directly in templates; only fall back to component `.css`
  files for things Tailwind can't express cleanly.
- Status/category indicators use the `badge-{green,yellow,red,blue,gray,purple}` helpers
  defined in `styles.css`, mapped from backend enum values via a `getXxxClass()` helper
  method on the component (see `ClaimsComponent.getStatusClass`).
