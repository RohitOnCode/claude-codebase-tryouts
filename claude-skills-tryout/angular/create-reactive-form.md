---
description: Use when the user wants to create a form, input form, registration form, login form, or any validated user input form in an Angular project
---

# Skill: Create Angular Reactive Form

Build a fully validated Angular reactive form for any use case.

## Instructions

1. Ask the user for:
   - The form's purpose (e.g. user registration, login, create project)
   - The list of fields and their types (text, email, password, number, select, textarea)
   - Validation rules for each field (required, minLength, maxLength, pattern, email)
   - Whether fields have dependencies (e.g. confirm password must match password)

2. Generate:
   - A standalone component with `ReactiveFormsModule`
   - A `FormGroup` built with `FormBuilder`
   - Inline error messages per field
   - A submit handler with loading state
   - Tailwind CSS styled inputs with error/focus states

3. Rules:
   - Use `inject(FormBuilder)` not constructor injection
   - Use `fb.nonNullable.group(...)` for type-safe forms
   - Validate on `blur` and on submit attempt
   - Show field errors only after the field is touched or submit is attempted
   - Emit a typed `formSubmit` output — do not couple to any service

## Example Output

```typescript
import { Component, output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input formControlName="email" type="email"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          [class.border-red-500]="isInvalid('email')" />
        @if (isInvalid('email')) {
          <p class="text-red-500 text-xs mt-1">Valid email is required.</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input formControlName="password" type="password"
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          [class.border-red-500]="isInvalid('password')" />
        @if (isInvalid('password')) {
          <p class="text-red-500 text-xs mt-1">Password must be at least 8 characters.</p>
        }
      </div>

      <button type="submit" [disabled]="loading()"
        class="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
        {{ loading() ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  `
})
export class LoginForm {
  formSubmit = output<{ email: string; password: string }>();
  loading = signal(false);
  submitted = signal(false);

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field)!;
    return (ctrl.touched || this.submitted()) && ctrl.invalid;
  }

  submit() {
    this.submitted.set(true);
    if (this.form.invalid) return;
    this.loading.set(true);
    this.formSubmit.emit(this.form.getRawValue());
  }
}
```

## Checklist Before Delivering
- [ ] `nonNullable` group used for type safety
- [ ] Errors shown only after touch or submit attempt
- [ ] Loading state on the submit button
- [ ] No direct service calls — uses output event
- [ ] All validators applied correctly
