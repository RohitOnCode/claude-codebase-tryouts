---
description: Use when the user wants to create an Angular service, data layer, API integration, or HTTP client service with state management in an Angular project
---

# Skill: Create Angular Service

Create a new Angular service with HTTP client integration and signal-based state.

## Instructions

1. Ask the user for:
   - Service name (e.g. `product`)
   - The API base URL or endpoint prefix (e.g. `/api/products`)
   - The data model / interface fields needed
   - Which CRUD operations are required (getAll, getById, create, update, delete)

2. Generate:
   - A TypeScript interface for the data model
   - A service class using `HttpClient` with signal-based state management

3. Follow these rules:
   - Use `@Injectable({ providedIn: 'root' })`
   - Use `inject(HttpClient)` instead of constructor injection
   - Expose data as readonly signals via `signal()` and `.asReadonly()`
   - Use `toSignal()` for converting observables where appropriate
   - Handle errors with `catchError` and surface them via an error signal
   - Use typed HTTP calls (e.g. `this.http.get<Product[]>(...)`)

## Example Output

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly BASE = '/api/products';

  private readonly _products = signal<Product[]>([]);
  private readonly _error = signal<string | null>(null);
  private readonly _loading = signal(false);

  readonly products = this._products.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loading = this._loading.asReadonly();

  loadAll() {
    this._loading.set(true);
    return this.http.get<Product[]>(this.BASE).pipe(
      tap(data => {
        this._products.set(data);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set(err.message);
        this._loading.set(false);
        return of([]);
      })
    );
  }

  getById(id: string) {
    return this.http.get<Product>(`${this.BASE}/${id}`);
  }

  create(payload: Omit<Product, 'id'>) {
    return this.http.post<Product>(this.BASE, payload).pipe(
      tap(p => this._products.update(list => [...list, p]))
    );
  }

  update(id: string, payload: Partial<Product>) {
    return this.http.put<Product>(`${this.BASE}/${id}`, payload).pipe(
      tap(p => this._products.update(list => list.map(x => x.id === id ? p : x)))
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.BASE}/${id}`).pipe(
      tap(() => this._products.update(list => list.filter(x => x.id !== id)))
    );
  }
}
```

## Checklist Before Delivering
- [ ] Interface defined in same file or imported
- [ ] All signals are readonly when exposed
- [ ] Loading and error states included
- [ ] HTTP calls are typed
- [ ] Optimistic updates applied where appropriate
