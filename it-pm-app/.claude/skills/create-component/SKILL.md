---
description: Use when the user wants to generate a new Angular standalone component, page, card, widget, or any UI element in an Angular project
---

# Skill: Create Angular Standalone Component

Create a new Angular standalone component based on the user's description.

## Instructions

1. Ask the user for:
   - Component name (e.g. `user-profile`)
   - Purpose / what it should display or do
   - Any inputs/outputs needed
   - Whether it needs a service injected

2. Generate a standalone component file following these rules:
   - Use `@Component` with `standalone: true` (Angular 17+)
   - Use `input()` and `output()` signals instead of `@Input`/`@Output` decorators
   - Use inline `template` (no separate HTML file unless explicitly requested)
   - Use Tailwind CSS utility classes for styling
   - Inject services using `inject()` function, not constructor injection
   - Use `computed()` for derived state
   - Name the class in PascalCase without the `Component` suffix (Angular 19 convention)

3. File naming: `<name>.ts` (no `.component.` in the filename)

## Example Output

```typescript
import { Component, input, output, inject, computed } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-card',
  imports: [],
  template: `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-semibold text-gray-900">{{ user().name }}</h3>
      <p class="text-sm text-gray-500">{{ user().email }}</p>
      <button
        (click)="select.emit(user())"
        class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
      >
        Select
      </button>
    </div>
  `
})
export class UserCard {
  user = input.required<{ name: string; email: string; id: string }>();
  select = output<{ name: string; email: string; id: string }>();
}
```

## Checklist Before Delivering
- [ ] Selector uses `app-` prefix
- [ ] All imports listed in the `imports` array
- [ ] No `NgModule` usage
- [ ] Signals used for reactive state
- [ ] Tailwind classes used for all styling
