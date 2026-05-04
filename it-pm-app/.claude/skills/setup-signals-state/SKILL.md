---
description: Use when the user wants to manage state, share data between components, set up a store, or implement reactive state with persistence in an Angular project
---

# Skill: Setup Signal-Based State Management

Implement reactive state management using Angular signals for any feature module.

## Instructions

1. Ask the user for:
   - The feature name (e.g. `cart`, `notifications`, `user-profile`)
   - The shape of the state (fields and types)
   - What actions/mutations are needed (e.g. add item, remove item, update quantity)
   - Whether the state should persist (localStorage) or be session-only

2. Generate a state service with:
   - A typed state interface
   - A private writable signal holding the full state
   - Public readonly computed signals for derived slices
   - Clean action methods that update state immutably
   - Optional localStorage persistence

3. Rules:
   - Use a single `signal<State>(initialState)` as the source of truth
   - Expose slices via `computed()` — never expose the raw writable signal
   - Update state with `.update(s => ({ ...s, field: newValue }))` for immutability
   - Use `effect()` for side effects like persistence — never mutate inside `computed()`
   - The service is `providedIn: 'root'` for global state, or provided in a component for local state

## Example Output

```typescript
import { Injectable, signal, computed, effect } from '@angular/core';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
}

const INITIAL_STATE: CartState = { items: [], couponCode: null };
const STORAGE_KEY = 'cart_state';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private readonly _state = signal<CartState>(this.loadFromStorage());

  // Derived computed signals
  readonly items       = computed(() => this._state().items);
  readonly itemCount   = computed(() => this._state().items.reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal    = computed(() => this._state().items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  readonly couponCode  = computed(() => this._state().couponCode);

  constructor() {
    // Persist to localStorage on every state change
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state()));
    });
  }

  addItem(item: Omit<CartItem, 'quantity'>) {
    this._state.update(s => {
      const existing = s.items.find(i => i.productId === item.productId);
      const items = existing
        ? s.items.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...s.items, { ...item, quantity: 1 }];
      return { ...s, items };
    });
  }

  removeItem(productId: string) {
    this._state.update(s => ({ ...s, items: s.items.filter(i => i.productId !== productId) }));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) { this.removeItem(productId); return; }
    this._state.update(s => ({
      ...s,
      items: s.items.map(i => i.productId === productId ? { ...i, quantity } : i)
    }));
  }

  applyCoupon(code: string) {
    this._state.update(s => ({ ...s, couponCode: code }));
  }

  clearCart() {
    this._state.set(INITIAL_STATE);
  }

  private loadFromStorage(): CartState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  }
}
```

## Usage in a Component

```typescript
@Component({ ... })
export class CartComponent {
  cart = inject(CartStateService);
}
```

```html
<p>{{ cart.itemCount() }} items — ${{ cart.subtotal() | number:'1.2-2' }}</p>
```

## Checklist Before Delivering
- [ ] Single source-of-truth signal
- [ ] All public properties are `computed()` — never expose writable signal
- [ ] State updated immutably with spread operator
- [ ] `effect()` used for side effects only
- [ ] localStorage load wrapped in try/catch
