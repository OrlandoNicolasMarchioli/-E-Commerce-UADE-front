# UADE E-Commerce — Frontend

> **Aplicaciones Interactivas · 2C-2026 · Universidad Argentina de la Empresa**
>
> Proyecto integrador inspirado en Mercado Libre. Marketplace universitario con soporte para productos físicos y servicios, carrito, órdenes, reseñas y panel de administración.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?logo=vitest&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + JSX |
| Build | Vite 8 |
| Styles | CSS custom properties (design tokens) |
| Testing | Vitest 5 + React Testing Library + happy-dom |
| Linter | Oxlint |
| Backend | Spring Boot · MySQL 8 · JWT |

---

## Getting Started

```bash
npm install
npm run dev        # App principal  → http://localhost:5173
npm run demo       # Component Library → http://localhost:5174/demo.html
npm run test       # Correr los 198 tests (single run)
npx vitest         # Tests en modo watch
npm run build      # Build de producción
npm run build:demo # Build de la demo
npm run preview    # Preview del build
```

> The backend runs at `http://localhost:8080`. See [endpoint inventory](docs/01-inventario-backend.md).

### App vs Demo

| Comando | Puerto | Descripción |
|---|---|---|
| `npm run dev` | 5173 | App principal (React Router + páginas) |
| `npm run demo` | 5174 | Catálogo interactivo de todos los componentes |

Ambos servidores pueden correr en paralelo.

---

## Project Structure

```
src/
├── components/                  # React component library
│   ├── ui.css                   # Shared stylesheet (all ui- prefixed classes)
│   ├── tokens/
│   │   ├── colors.js            # ColorTokens ES6 class (CSS var references)
│   │   └── typography.js        # TypographyTokens ES6 class
│   ├── primitives/              # Base UI elements
│   │   ├── Button/
│   │   ├── Badge/               # OrderStatusBadge
│   │   ├── QuantityStepper/
│   │   ├── StarSelector/
│   │   ├── Pagination/
│   │   ├── ActiveFilterTags/
│   │   ├── ViewToggle/
│   │   └── SuccessBanner/
│   ├── navigation/              # Navigation and layout chrome
│   │   ├── Navbar/
│   │   ├── Breadcrumb/
│   │   ├── CategoryStrip/
│   │   ├── StatusTabBar/
│   │   ├── FilterSidebar/
│   │   └── CategoryHeroBanner/
│   ├── layout/                  # Full-width page sections
│   │   ├── HeroBanner/
│   │   └── Footer/
│   ├── auth/
│   │   └── AuthCard/            # Login / Register tabs
│   ├── products/                # Product-related components
│   │   ├── ProductCard/
│   │   ├── ProductImageGallery/
│   │   ├── BuyPanel/
│   │   ├── ImageUploadArea/
│   │   ├── ProductFormCard/
│   │   ├── ProductPreviewCard/
│   │   └── ProductContextStrip/
│   ├── cart/                    # Shopping cart
│   │   ├── CartItem/
│   │   ├── OrderSummary/
│   │   └── EmptyState/
│   ├── orders/                  # Order tracking
│   │   ├── OrderCard/
│   │   ├── OrderTimeline/
│   │   ├── OrderStatusAction/
│   │   ├── OrderNumberPill/
│   │   └── NextStepsList/
│   ├── reviews/                 # Product reviews
│   │   ├── ReviewSummary/
│   │   ├── ReviewCard/
│   │   └── ReviewEditForm/
│   ├── user/                    # User profile
│   │   ├── ProfileHeader/
│   │   ├── ProfileNav/
│   │   ├── UserAvatar/
│   │   └── StatCard/
│   ├── admin/                   # Admin panel components
│   │   ├── AdminStatsBar/
│   │   ├── AdminToolbar/
│   │   ├── ProductTableRow/
│   │   ├── OrderTableRow/
│   │   ├── UserTableRow/
│   │   ├── CategoryListItem/
│   │   └── CategoryFormPanel/
│   └── overlays/                # Modals and toasts
│       ├── Modal/               # Modal, ConfirmDeleteModal, CheckoutModal
│       ├── Toast/               # ToastContainer + useToast hook
│       └── SuccessCircle/
├── pages/
│   └── ComponentLibraryPage/    # Interactive demo of all components
├── tests/                       # All unit tests (mirrors component structure)
│   ├── primitives/
│   ├── navigation/
│   ├── layout/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── reviews/
│   ├── user/
│   ├── admin/
│   └── overlays/
├── test/
│   └── setup.js                 # @testing-library/jest-dom setup
├── theme/
│   ├── tokens.css               # CSS custom properties (:root)
│   ├── tokens.json              # Tokens Studio for Figma
│   └── index.js                 # JS token exports
├── App.jsx
└── main.jsx
docs/
├── 01-inventario-backend.md
├── 02-matriz-cobertura.md
├── 03-wireflow.md
├── 04-design-system.md
└── mockups/
    └── 00-tokens.html … 18-component-library.html
```

---

## Component Library

54 reusable components built from all 18 screen mockups, organized into 11 modules.

### Design Tokens

Token classes are in `src/components/tokens/`:

```js
import ColorTokens from './tokens/colors';
import TypographyTokens from './tokens/typography';

// CSS variable references
ColorTokens.brand.primary         // 'var(--color-brand-primary)'
ColorTokens.neutral[100]          // 'var(--color-neutral-100)'
TypographyTokens.fontSize.xl      // 'var(--font-size-xl)'
TypographyTokens.fontWeight.bold  // 'var(--font-weight-bold)'
```

All component styles live in `src/components/ui.css` (single shared file, `ui-` prefix convention).

### Component Inventory

| Module | Components |
|---|---|
| **primitives** | Button · OrderStatusBadge · QuantityStepper · StarSelector · Pagination · ActiveFilterTags · ViewToggle · SuccessBanner |
| **navigation** | Navbar · Breadcrumb · CategoryStrip · StatusTabBar · FilterSidebar · CategoryHeroBanner |
| **layout** | HeroBanner · Footer |
| **auth** | AuthCard |
| **products** | ProductCard · ProductImageGallery · BuyPanel · ImageUploadArea · ProductFormCard · ProductPreviewCard · ProductContextStrip |
| **cart** | CartItem · OrderSummary · EmptyState |
| **orders** | OrderCard · OrderTimeline · OrderStatusAction · OrderNumberPill · NextStepsList |
| **reviews** | ReviewSummary · ReviewCard · ReviewEditForm |
| **user** | ProfileHeader · ProfileNav · UserAvatar · StatCard |
| **admin** | AdminStatsBar · AdminToolbar · ProductTableRow · OrderTableRow · UserTableRow · CategoryListItem · CategoryFormPanel |
| **overlays** | Modal · ConfirmDeleteModal · CheckoutModal · ToastContainer · SuccessCircle |

### Demo

All components are demonstrated interactively in `ComponentLibraryPage`. Run the app and navigate to `http://localhost:5173`.

---

## Testing

Tests use **Vitest 5** + **React Testing Library** + **happy-dom**.

```bash
npm run test          # single run
npx vitest            # watch mode
npx vitest --reporter=verbose   # detailed output
```

- **51 test files** · **198 tests** — all passing
- Tests are in `src/tests/` mirroring the `src/components/` structure
- Each component has tests for: rendering, user interactions, edge cases, and accessibility attributes

---

## Design System

Tokens are in `src/theme/` and consumed via CSS custom properties in all components:

```jsx
// Recommended — CSS custom properties
import '../../theme/tokens.css';
// Usage: var(--color-brand-primary), var(--space-4), etc.

// Alternative — JS tokens
import tokens from '../../theme/index.js';
// Usage: tokens.color.brand.primary
```

### Main Palette

| Token | Value | Usage |
|---|---|---|
| `--color-brand-primary` | `#002D62` | Navbar, primary buttons, headings |
| `--color-brand-secondary` | `#0070C0` | Links, secondary buttons, focus rings |
| `--color-brand-accent` | `#FFB800` | Cart button, search, highlights |
| `--color-success` | `#059669` | In stock, delivered status |
| `--color-error` | `#DC2626` | Errors, out of stock, cancelled |

---

## Mockups — 18 screens

All mockups are static HTML using only CSS custom properties from the design system (no hardcoded colors or sizes).

| # | Screen | Covered Endpoints |
|---|---|---|
| [00](docs/mockups/00-tokens.html) | Design System / Token Showcase | — |
| [01](docs/mockups/01-home.html) | Home · HeroBanner · CategoryBar · ProductGrid | `GET /api/products` · `GET /api/category` |
| [02](docs/mockups/02-login-register.html) | Login / Register | `POST /api/auth/login` · `POST /api/auth/register` |
| [03](docs/mockups/03-search.html) | Search with filters and pagination | `GET /api/products` (client-side filter) |
| [04](docs/mockups/04-product-detail.html) | Product detail · Gallery · Reviews | `GET /api/products/{id}` · `GET /api/products/{id}/images` · `GET /api/products/{id}/reviews` |
| [05](docs/mockups/05-cart.html) | Cart · Checkout modal | `GET /api/cart` · `POST /api/cart/items` · `DELETE /api/cart/items/{id}` |
| [06](docs/mockups/06-my-orders.html) | My orders · filter by status | `GET /api/orders?userId=` |
| [07](docs/mockups/07-order-detail.html) | Order detail · Status timeline | `GET /api/orders/{id}` · `PUT /api/orders/{id}/status` |
| [08](docs/mockups/08-profile.html) | Profile · edit personal data | `GET /api/users/{id}` · `PUT /api/users/{id}` |
| [09](docs/mockups/09-admin-products.html) | Admin · product table | `GET /api/products` · `DELETE /api/products/{id}` |
| [10](docs/mockups/10-product-form.html) | Admin · create/edit product form | `POST /api/products` · `PUT /api/products/{id}` · `POST/DELETE /api/products/{id}/images` |
| [11](docs/mockups/11-admin-categories.html) | Admin · category CRUD | `GET/POST/PUT/DELETE /api/category` |
| [12](docs/mockups/12-admin-users.html) | Admin · user management | `GET /api/users` · `DELETE /api/users/{id}` |
| [13](docs/mockups/13-category-results.html) | Category results page | `GET /api/products/category/{id}` |
| [14](docs/mockups/14-checkout-success.html) | Order confirmation (post-checkout) | `POST /api/orders` → 201 |
| [15](docs/mockups/15-admin-orders.html) | Admin · order management · status update | `PUT /api/orders/{id}/status` |
| [16](docs/mockups/16-cart-states.html) | Empty cart · add-to-cart toast · clear cart | `POST /api/cart/items` · `DELETE /api/cart` |
| [17](docs/mockups/17-review-edit.html) | Inline review editing · confirm delete | `PUT /api/products/{id}/reviews/{reviewId}` · `DELETE /api/products/{id}/reviews/{reviewId}` |
| [18](docs/mockups/18-component-library.html) | Component Library — full component catalog | — (design reference) |

---

## Backend API

- **Base URL:** `http://localhost:8080/api`
- **Auth:** `Authorization: Bearer <JWT>` · HMAC-SHA256 · 24h expiry
- **Roles:** `USER` · `ADMIN`
- **DB:** MySQL 8 · `ecommerce_db3`

See the [full endpoint inventory](docs/01-inventario-backend.md) with request/response examples.

---

## Known Backend Gaps

Current backend limitations the frontend must handle:

| # | Gap | Impact |
|---|---|---|
| G1 | CORS not configured | Frontend cannot call backend without a proxy |
| G2 | No keyword search endpoint | Filtering done client-side over `GET /api/products` |
| G3 | No pagination on `GET /api/products` | All products fetched in a single call |
| G4 | No `GET /api/products?publisherId=` | No "my listings" for regular users |
| G5 | `POST /api/products` requires ADMIN | Regular users cannot publish |
| G6 | `PUT /api/orders/{id}/status` requires ADMIN | Users can only cancel, not advance status |
| G7 | No `GET /api/users/me` | Frontend must store userId from JWT token |
| G8 | `UserResponseDTO` does not include `role` (added by back PR #15) | The JWT does not carry it either (only `sub`, `iat`, `exp`); the mocks already include `role` |
| G9 | No global `GET /api/orders` for ADMIN | Admin cannot list all orders without knowing userId |
