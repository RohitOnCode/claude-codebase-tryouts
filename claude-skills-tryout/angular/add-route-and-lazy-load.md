---
description: Use when the user wants to add a new route, page navigation, lazy-loaded route, or route guard to an Angular application
---

# Skill: Add Route with Lazy Loading

Add a new page route to an Angular application with lazy loading and optional guards.

## Instructions

1. Ask the user for:
   - The route path (e.g. `products`, `admin/users`)
   - The component to load (name and file path)
   - Whether a route guard is needed (auth, role-based)
   - Whether the route has child routes or params (e.g. `:id`)
   - The page title

2. Perform these steps:
   - Open `app.routes.ts` and add the new route
   - Use `loadComponent` for lazy loading (never eagerly import the component)
   - Apply guards using the functional `canActivate` form
   - Add a `title` field for the browser tab
   - If child routes are needed, use `children` array with their own `loadComponent`

3. Rules:
   - Always use lazy loading via `loadComponent: () => import(...).then(m => m.ClassName)`
   - Never add the component to a `NgModule`
   - Guards must be functional (`CanActivateFn`), not class-based
   - Keep routes sorted logically (public first, protected second, wildcard last)

## Example Output

Add to `src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
    title: 'Sign In'
  },

  // Protected routes
  {
    path: 'products',
    canActivate: [authGuard],
    title: 'Products',
    loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList),
  },
  {
    path: 'products/:id',
    canActivate: [authGuard],
    title: 'Product Detail',
    loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetail),
  },

  // Wildcard
  { path: '**', redirectTo: 'dashboard' }
];
```

## Checklist Before Delivering
- [ ] `loadComponent` used (not `component`)
- [ ] Import path resolves to the correct file
- [ ] Guard applied where required
- [ ] `title` field set
- [ ] Wildcard route is last
- [ ] No circular imports introduced
