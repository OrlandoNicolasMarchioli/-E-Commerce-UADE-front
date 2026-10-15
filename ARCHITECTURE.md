# Frontend Architecture — Feature-Sliced Design (FSD)

This project follows a simplified version of [Feature-Sliced Design](https://feature-sliced.design/).
The core idea is to organize code by **business layer**, not by file type.

---

## Layer Overview

```
src/
├── app/              # Global setup: router, providers, global styles
├── pages/            # One folder per route/screen
├── features/         # Self-contained use cases (user actions)
├── entities/         # Domain models + their UI and service logic
├── shared/           # Reusable code with no business logic
│   ├── ui/           # → src/components/ (existing component library)
│   ├── api/          # → src/services/api/ (networking layer)
│   ├── hooks/        # Generic reusable hooks
│   └── utils/        # Pure utility functions
```

---

## Dependency Rule

Layers can only import **downward**. Never upward, never sideways within the same layer.

```
app
 └── pages
      └── features
           └── entities
                └── shared
```

> A `feature` can import from `entities` and `shared`.
> An `entity` can import from `shared` only.
> `shared` imports nothing from this project.

---

## Layer Definitions

### `app/`
Global application configuration. Things that run once at startup.

**Includes:**
- Root component with providers (Router, AuthContext, ToastProvider)
- Global error boundaries
- Route definitions

**Does not include:** any UI or business logic directly.

---

### `pages/`
One folder per screen. Pages are thin — they compose features and entities,
they do not contain logic themselves.

```
pages/
  HomePage/
  ProductDetailPage/
  CartPage/
  OrdersPage/
  AdminProductsPage/
  ...
```

**A page only does:**
- Fetch the data its features need (or delegates to them)
- Lay out features/entities on screen
- Handle routing params

---

### `features/`
A **feature** is a complete user action: something the user *does*.
Each feature is self-contained: UI + state + any API calls it needs.

```
features/
  auth/             # Login / Register / Logout flow
  cart/             # Add to cart, remove, update quantity, checkout
  product-search/   # Search bar, filters, sort, pagination, view toggle
  review/           # Write, edit, delete a review
```

**Internal structure (per feature):**
```
features/auth/
  ui/               # Components specific to this feature
  model/            # State: useState, useReducer, or Zustand slice
  api/              # API calls used by this feature (uses shared/api/client)
  index.js          # Public API — only export what pages need
```

**Rule:** A feature must not import from another feature.
If two features share something, move it to `entities/` or `shared/`.

---

### `entities/`
Domain objects and their representations. An entity is a *thing* in the system,
not an action.

```
entities/
  product/          # ProductCard, productService, Product types
  order/            # OrderCard, OrderTimeline, orderService
  user/             # UserAvatar, ProfileHeader, userService
  category/         # CategoryStrip, categoryService
```

**Internal structure (per entity):**
```
entities/product/
  ui/               # ProductCard, ProductPreviewCard, etc. (moved from shared/ui eventually)
  api/              # productService.js (uses shared/api/client)
  model/            # Types, constants (ProductType enum, etc.)
  index.js          # Public API
```

---

### `shared/`
Utilities and primitives with zero knowledge of the domain.

| Folder | What goes here |
|---|---|
| `shared/ui/` | Primitive components: Button, Modal, Badge, Pagination, etc. Currently `src/components/` |
| `shared/api/` | HTTP client and endpoint constants. Currently `src/services/api/` |
| `shared/hooks/` | Generic hooks: `useDebounce`, `useLocalStorage`, `useMediaQuery` |
| `shared/utils/` | Pure functions: `formatPrice`, `formatDate`, `cn` (classNames helper) |

**Rule:** `shared/` must never import from `features/`, `entities/`, `pages/`, or `app/`.

---

## Current State vs Target State

The project is in **transition**. Existing code lives in legacy folders that map to FSD layers:

| Current path | FSD layer | Notes |
|---|---|---|
| `src/components/primitives/` | `shared/ui/` | Migrate as pages are built |
| `src/components/navigation/` | `shared/ui/` or `entities/` | Navbar → `app/`, rest → entities |
| `src/components/products/` | `entities/product/ui/` | Migrate when building product pages |
| `src/components/admin/` | `entities/` (per domain) | Migrate when building admin pages |
| `src/components/overlays/` | `shared/ui/` | Modal, Toast are shared primitives |
| `src/services/api/` | `shared/api/` | Already in correct location |
| `src/pages/` | `pages/` | Correct — expand with real route pages |

**Migration strategy:** Do not migrate everything at once.
When you build a new page or feature, create it in the correct FSD folder.
Legacy components stay where they are until naturally replaced.

---

## Example: Adding a New Feature

**Task:** Implement the "Add to Cart" button on the product detail page.

```
1. Create features/cart/
   ├── ui/
   │   └── AddToCartButton.jsx      ← button + quantity stepper
   ├── model/
   │   └── useCart.js               ← cart state hook
   ├── api/
   │   └── cartService.js           ← uses shared/api/client
   └── index.js                     ← export { AddToCartButton, useCart }

2. Create entities/product/
   ├── ui/
   │   └── ProductDetail.jsx        ← product info display
   ├── api/
   │   └── productService.js
   └── index.js

3. In pages/ProductDetailPage/ProductDetailPage.jsx:
   import { ProductDetail } from '../../entities/product';
   import { AddToCartButton } from '../../features/cart';
```

---

## What NOT to do

- Do not import a `feature` from another `feature`
- Do not import from `pages/` anywhere except `app/`
- Do not put business logic in `shared/`
- Do not create god-components that mix display + state + API calls
- Do not skip the `index.js` public API — it controls what leaks out of a layer
