# UADE E-Commerce Front-end — AI Context File

> This file is the single source of truth for AI assistants working on this codebase.
> It covers architecture, all components and their APIs, the design system, test infrastructure, and key patterns.

---

## 1. Project Overview

Academic e-commerce front-end project for UADE (Universidad Argentina de la Empresa).
The project is a React 19 component library + design system built on top of Vite 8.

There is no routing yet. The app shell (`src/App.jsx`) is a placeholder.
Real pages will be added later with React Router.

Two entry points exist:
| Entry | URL | Purpose |
|---|---|---|
| `index.html` → `src/main.jsx` | `http://localhost:5173` | Main app shell |
| `demo.html` → `src/demo.jsx` | `http://localhost:5174` | Interactive component library demo |

---

## 2. Architecture

This project follows **Feature-Sliced Design (FSD)**. Full details in `ARCHITECTURE.md`.

### Layer hierarchy (imports flow downward only)
```
app → pages → features → entities → shared
```

| Layer | Path | Purpose |
|---|---|---|
| `app` | `src/app/` | Router, providers, global config |
| `pages` | `src/pages/` | One folder per route — thin, composing layer |
| `features` | `src/features/` | Self-contained user actions (auth, cart, review, product-search) |
| `entities` | `src/entities/` | Domain models + their UI + service (product, order, user, category) |
| `shared/ui` | `src/components/` | Primitive components (Button, Modal, Badge…) |
| `shared/api` | `src/services/api/` | HTTP client + endpoint constants |
| `shared/hooks` | `src/shared/hooks/` | Generic hooks (useDebounce, useLocalStorage…) |
| `shared/utils` | `src/shared/utils/` | Pure functions (formatPrice, formatDate…) |

> `src/components/` is the current `shared/ui/`. Migrate components into `entities/` as pages are built.
> A **feature** must never import from another feature — extract shared logic to `entities/` or `shared/`.

---

## 3. Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Bundler / dev server |
| Vitest | 5 | Unit test runner |
| @testing-library/react | 16 | Component testing |
| happy-dom | 21 | DOM environment for tests (NOT jsdom — jsdom has ESM incompatibility on this setup) |
| oxlint | 1.81 | Linter |
| @vitejs/plugin-react | 6 | JSX transform |

---

## 3. Commands

```bash
npm run dev          # start main app on port 5173
npm run demo         # start component library demo on port 5174
npm run build        # production build of main app
npm run build:demo   # production build of demo
npm run test         # run all unit tests (vitest run)
npm run lint         # run oxlint
```

---

## 4. Project Structure

```
/
├── index.html                  # Main app entry
├── demo.html                   # Component demo entry
├── vite.config.js              # Vite + Vitest config (happy-dom, globals: true)
├── vite.demo.config.js         # Separate Vite config for demo server (port 5174)
├── package.json
├── CONTEXT.md                  # This file
├── README.md                   # Project documentation
└── src/
    ├── main.jsx                # Mounts App
    ├── App.jsx                 # Placeholder shell
    ├── demo.jsx                # Mounts ComponentLibraryPage
    ├── index.css               # Global reset
    ├── theme/
    │   ├── tokens.css          # CSS custom properties (design tokens)
    │   └── index.js            # Re-exports token classes
    ├── pages/
    │   └── ComponentLibraryPage/ComponentLibraryPage.jsx
    ├── test/
    │   └── setup.js            # Vitest setup: imports @testing-library/jest-dom
    ├── components/
    │   ├── ui.css              # Single shared stylesheet (all ui-* classes)
    │   ├── tokens/
    │   │   ├── colors.js       # ColorTokens class (static props → CSS var strings)
    │   │   └── typography.js   # TypographyTokens class
    │   ├── primitives/         # Atomic UI building blocks
    │   ├── navigation/         # Navbar, filters, categories, breadcrumb
    │   ├── layout/             # Page-level sections (hero, footer)
    │   ├── auth/               # Login / register card
    │   ├── products/           # Product card, gallery, buy panel, forms
    │   ├── cart/               # Cart items, order summary
    │   ├── orders/             # Order card, timeline, status actions
    │   ├── reviews/            # Review summary, card, edit form
    │   ├── user/               # Profile header/nav, avatar, stat card
    │   ├── admin/              # Admin tables, toolbars, forms
    │   └── overlays/           # Modals, toasts, animations
    └── tests/                  # Mirror of src/components/ — all .test.jsx files
        ├── primitives/
        ├── navigation/
        ├── layout/
        ├── auth/
        ├── products/
        ├── cart/
        ├── orders/
        ├── reviews/
        ├── user/
        ├── admin/
        └── overlays/
```

---

## 5. Design System

### 5.1 CSS Architecture

All component styles live in **`src/components/ui.css`**. Every class is prefixed with `ui-` to avoid collisions. Components import this file directly (`import '../../ui.css'`).

Do not create per-component CSS files. Add new styles to `ui.css`.

### 5.2 Design Tokens

Tokens are defined as CSS custom properties in `src/theme/tokens.css` and consumed via `var(--token-name)`.

Key token categories:
```css
/* Colors */
--color-brand-primary          /* main blue */
--color-brand-primary-light
--color-accent                 /* orange/yellow CTA */
--color-neutral-0 … --color-neutral-900
--color-success / --color-error / --color-warning

/* Typography */
--font-family-base
--font-size-xs / sm / base / lg / xl / 2xl / 3xl
--font-weight-regular / medium / semibold / bold

/* Spacing */
--space-1 … --space-10 (4px grid)

/* Radius */
--radius-sm / md / lg / full

/* Shadows */
--shadow-sm / md / lg
```

### 5.3 Token Classes (JS)

`src/components/tokens/colors.js` exports a `ColorTokens` class with static string properties. Use these when you need to reference CSS variables from JavaScript:

```js
import { ColorTokens } from '../tokens/colors';
// ColorTokens.brandPrimary === 'var(--color-brand-primary)'
```

Same pattern in `typography.js` → `TypographyTokens`.

---

## 6. Components Reference

### 6.1 `primitives/`

#### `Button`
```jsx
<Button
  variant="primary"   // 'primary' | 'outline' | 'ghost' | 'danger' | 'accent'
  size="md"           // 'sm' | 'md' | 'lg'
  disabled={false}
  loading={false}     // shows ⟳ spinner, disables click
  icon={null}         // node rendered before label
  iconOnly={false}    // square button — no label, no size modifier
  round={false}       // circular icon button
  fullWidth={false}
  type="button"
  onClick={fn}
>
  Label
</Button>
```

#### `Badge` / `OrderStatusBadge` / `StockBadge`
```jsx
// Generic badge
<Badge label="New" variant="physical" />
// variant: 'physical' | 'service' | 'in-stock' | 'out-of-stock' | 'mine' | any order status

// Order-specific (maps status string → variant automatically)
<OrderStatusBadge status="PENDING" />
// statuses: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

// Stock-specific
<StockBadge stock={5} type="PHYSICAL" />
```

#### `QuantityStepper`
Supports **controlled** (`value` prop) and **uncontrolled** (`defaultValue`) modes.
```jsx
// Controlled
<QuantityStepper value={qty} onChange={setQty} min={1} max={10} />

// Uncontrolled
<QuantityStepper defaultValue={1} onChange={(n) => console.log(n)} />
```

#### `StarSelector`
Supports **controlled**, **uncontrolled**, and **readOnly** modes.
```jsx
// Controlled
<StarSelector value={rating} onChange={setRating} />

// ReadOnly display
<StarSelector value={4} readOnly />
```

#### `Pagination`
```jsx
<Pagination
  currentPage={3}
  totalPages={12}
  onPageChange={(page) => setPage(page)}
/>
```
Collapses middle pages to ellipsis when `totalPages > 7`.

#### `ActiveFilterTags`
```jsx
<ActiveFilterTags
  filters={[{ id: 'type-physical', label: 'Physical' }]}
  onRemove={(id) => removeFilter(id)}
  onClearAll={() => clearAll()}
/>
```
Renders nothing when `filters` is empty.

#### `ViewToggle`
```jsx
<ViewToggle value="grid" onChange={(mode) => setView(mode)} />
// mode: 'grid' | 'list'
```

#### `SuccessBanner`
```jsx
<SuccessBanner message="Order placed successfully!" />
```

---

### 6.2 `navigation/`

#### `Navbar`
```jsx
<Navbar
  user={null}         // null → shows Sign in / Sign up; { firstName, lastName } → shows name
  cartCount={3}
  isAdmin={false}     // true → renders admin nav (no search, no cart)
  onSearch={(q) => {}}
  onCart={() => {}}
  onLogin={() => {}}
  onRegister={() => {}}
/>
```
Admin mode shows: logo + ADMIN badge, section links (Categories / Products / Orders / Users), user name.

#### `Breadcrumb`
```jsx
<Breadcrumb crumbs={[
  { label: 'Home', href: '/' },
  { label: 'Electronics' },   // last item has no href → rendered as text
]} />
```

#### `CategoryStrip`
```jsx
<CategoryStrip
  categories={[{ id: 1, name: 'Electronics', icon: '💻' }]}
  activeId={1}
  onSelect={(id) => setCategory(id)}
/>
```
Calls `onSelect(cat.id)` on click. Active item gets `ui-cs-item--active` class.

#### `StatusTabBar`
```jsx
<StatusTabBar
  tabs={[{ id: 'all', label: 'All' }, { id: 'PENDING', label: 'Pending' }]}
  activeId="all"
  onChange={(id) => setTab(id)}
/>
```

#### `FilterSidebar`
Supports **controlled** (`filters` prop) and **uncontrolled** modes.
```jsx
// Controlled
<FilterSidebar
  filters={{ types: ['PHYSICAL'], stock: 'all', priceMin: '', priceMax: '' }}
  onChange={(f) => setFilters(f)}
/>

// Uncontrolled (manages its own state)
<FilterSidebar onChange={(f) => applyFilters(f)} />
```
Sections: **Type** (Physical / Service checkboxes), **Stock** (All / In stock radio), **Price** (min/max inputs + Apply button).

#### `CategoryHeroBanner`
```jsx
<CategoryHeroBanner
  icon="💻"
  title="Electronics"
  description="Laptops, phones, and more"
  productCount={42}   // optional; renders a pill if provided
/>
```

---

### 6.3 `layout/`

#### `HeroBanner`
```jsx
<HeroBanner
  title="Welcome to UADE Store"
  subtitle="Find the best products"
  ctaLabel="Shop Now"    // default: 'Shop Now'
  onCta={() => {}}
  imagePlaceholder={null} // optional node; defaults to '🖼 Product image'
/>
```

#### `Footer`
```jsx
<Footer
  columns={[
    { heading: 'Company', links: [{ label: 'About', href: '/about' }] }
  ]}
  copyright="© 2024 E-Commerce. All rights reserved."
/>
```

---

### 6.4 `auth/`

#### `AuthCard`
```jsx
<AuthCard
  onLogin={(form) => {}}    // { email, password }
  onRegister={(form) => {}} // { name, email, password }
/>
```
Toggles between Sign In and Create Account tabs. Validates required fields client-side before calling callbacks.

---

### 6.5 `products/`

#### `ProductCard`
```jsx
<ProductCard
  product={{
    id: 1,
    name: 'Laptop X',
    price: 250000,
    type: 'PHYSICAL',        // 'PHYSICAL' | 'SERVICE'
    stock: 5,
    category: { name: 'Electronics' },
    images: [{ url: '...' }],
    averageRating: 4.2,
    reviewCount: 18,
    minutesDuration: null,   // for SERVICE type
  }}
  onClick={(id) => navigate(`/product/${id}`)}
/>
```
`onClick` receives `product.id`. Price formatted as ARS locale.

#### `ProductImageGallery`
```jsx
<ProductImageGallery
  images={[{ url: '...', alt: 'Front view' }]}
/>
```
Thumbnail strip below main image. Clicking thumbnail swaps the main image.

#### `BuyPanel`
```jsx
<BuyPanel
  product={{ price: 250000, stock: 5, type: 'PHYSICAL', seller: { firstName: 'Ana', lastName: 'López' } }}
  onBuy={(qty) => {}}
  onAddToCart={(qty) => {}}
/>
```
Quantity stepper only shown for PHYSICAL products with stock > 0. Seller block shown when `product.seller` is provided.

#### `ImageUploadArea`
```jsx
<ImageUploadArea
  images={[{ file: File, url: 'data:...' }]}
  onAdd={({ file, url }) => {}}
  onRemove={(index) => {}}
/>
```
Converts selected files to data URLs via FileReader for local preview before upload.

#### `ProductFormCard`
```jsx
<ProductFormCard
  initialValues={{ name: 'Laptop', category: 'Electronics', price: '250000', stock: '5', description: '' }}
  categories={['Electronics', 'Clothing']}
  onSubmit={(formData, images) => {}}
  onCancel={() => {}}
/>
```
Pre-fills from `initialValues` for edit mode. Embeds `ImageUploadArea`.

#### `ProductPreviewCard`
```jsx
<ProductPreviewCard
  name="Laptop X"
  category="Electronics"
  price="250000"
  stock="5"
  description="A great laptop."
  imageUrl={null}
/>
```
Read-only preview. Used alongside `ProductFormCard` as a live preview.

#### `ProductContextStrip`
```jsx
<ProductContextStrip
  imageUrl="..."
  name="Laptop X"
  category="Electronics"
/>
```
Compact strip for showing product context above review or order forms.

---

### 6.6 `cart/`

#### `CartItem`
```jsx
<CartItem
  item={{
    productId: 1,
    productName: 'Laptop X',
    productCategory: 'Electronics',
    quantity: 2,
    unitPrice: 250000,
    subtotal: 500000,     // optional; falls back to unitPrice × quantity
    imageUrl: null,
  }}
  onQtyChange={(productId, newQty) => {}}
  onRemove={(productId) => {}}
/>
```
Remove button text: `🗑️ Remove`.

#### `OrderSummary`
```jsx
<OrderSummary
  items={[
    { productName: 'Laptop X', quantity: 1, unitPrice: 250000 }
  ]}
  onConfirm={() => {}}
/>
```
Calculates subtotal from `unitPrice × quantity` per item. Confirm button: `Confirm purchase`.

#### `EmptyState`
```jsx
<EmptyState
  icon="🛒"
  title="Your cart is empty"
  message="Add some products to get started."
  actionLabel="Go shopping"
  onAction={() => {}}
/>
```

---

### 6.7 `orders/`

#### `OrderCard`
```jsx
<OrderCard
  order={{
    id: 'ORD-001',
    date: '2024-10-15',
    status: 'PENDING',
    items: [{ name: 'Laptop X', qty: 1, price: 250000 }],
    total: 250000,
  }}
  onView={(order) => {}}
/>
```

#### `OrderTimeline`
```jsx
<OrderTimeline status="SHIPPED" />
// statuses: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
```
CANCELLED renders a red notice. Other statuses render a progress bar across 4 steps.

#### `OrderStatusAction`
```jsx
<OrderStatusAction
  orderId="ORD-001"
  currentStatus="PENDING"
  onAdvance={(orderId, nextStatus) => {}}
/>
```
Transitions: PENDING→PAID→SHIPPED→DELIVERED. Terminal statuses (DELIVERED, CANCELLED) render a disabled `Final state` button.

#### `OrderNumberPill`
```jsx
<OrderNumberPill orderId="ORD-001" />
// renders: #ORD-001
```

#### `NextStepsList`
```jsx
<NextStepsList
  steps={[
    { icon: '📧', title: 'Check your email', description: 'Order confirmation sent.' }
  ]}
/>
```

---

### 6.8 `reviews/`

#### `ReviewSummary`
```jsx
<ReviewSummary
  reviews={[
    { rating: 5 }, { rating: 4 }, { rating: 3 }
  ]}
/>
```
Calculates average and per-star distribution internally. Renders nothing when `reviews` is empty.

#### `ReviewCard`
```jsx
<ReviewCard
  review={{
    id: 1,
    rating: 5,
    comment: 'Excellent product!',
    reviewDate: '2024-10-15',
    firstName: 'Ana',
    lastName: 'López',
  }}
  isOwner={false}       // true → shows Edit / Delete buttons
  onEdit={(review) => {}}
  onDelete={(id) => {}}
/>
```
Edit button text: `✏️ Edit`. Delete button text: `🗑️ Delete`.

#### `ReviewEditForm`
```jsx
<ReviewEditForm
  initialRating={0}
  initialComment=""
  onSave={({ rating, comment }) => {}}
  onCancel={() => {}}
/>
```
Save button is disabled until a star rating > 0 is selected. Embeds `StarSelector`.

---

### 6.9 `user/`

#### `ProfileHeader`
```jsx
<ProfileHeader
  user={{ firstName: 'Ana', lastName: 'López', email: 'ana@mail.com', isEnabled: true }}
  onEdit={() => {}}
/>
```

#### `ProfileNav`
```jsx
<ProfileNav
  tabs={[{ id: 'orders', label: 'My Orders' }, { id: 'profile', label: 'Profile' }]}
  activeId="orders"
  onChange={(id) => setTab(id)}
/>
```
Prop is `onChange` (not `onSelect`), active tab identified by `id` (not `value`).

#### `UserAvatar`
```jsx
<UserAvatar
  user={{ firstName: 'Ana', lastName: 'López' }}
  size="md"     // 'sm' | 'md' | 'lg'
  color={null}  // optional override; defaults to deterministic palette color from name
/>
```
Shows initials. Background color is deterministic based on `firstName.charCodeAt(0)`.

#### `StatCard`
```jsx
<StatCard value="1,234" label="Total Orders" color="var(--color-brand-primary)" />
```
Props: `value`, `label`, `color`. No `trend` or `icon` props on this component (those are on `AdminStatsBar`).

---

### 6.10 `admin/`

#### `AdminStatsBar`
```jsx
<AdminStatsBar
  stats={[
    { icon: '📦', value: '1,234', label: 'Products', trend: 12 },
    { icon: '🛒', value: '567', label: 'Orders', trend: -3 },
  ]}
/>
```
`trend` is a signed number (positive = up arrow, negative = down arrow). Renders a CSS grid, column count = `stats.length`.

#### `AdminToolbar`
```jsx
<AdminToolbar
  searchPlaceholder="Search products…"
  onSearch={(q) => {}}
  onAdd={() => {}}
  addLabel="Add Product"
>
  {/* optional extra controls */}
</AdminToolbar>
```
`onSearch` and `onAdd` are both optional — omitting either hides that control.

#### `ProductTableRow`
```jsx
<ProductTableRow
  product={{ id: 1, name: 'Laptop', category: 'Electronics', price: 250000, stock: 5, imageUrl: null }}
  onEdit={(product) => {}}
  onDelete={(product) => {}}
/>
```
Must be rendered inside a `<table><tbody>`.

#### `OrderTableRow`
```jsx
<OrderTableRow
  order={{ id: 'ORD-001', customer: 'Ana López', date: '2024-10-15', items: 2, total: 500000, status: 'PENDING' }}
  onView={(order) => {}}
  onUpdateStatus={(order) => {}}  // optional; omitting hides the Update button
/>
```

#### `UserTableRow`
```jsx
<UserTableRow
  user={{ name: 'Ana López', email: 'ana@mail.com', role: 'BUYER', joinDate: '2024-01-01', blocked: false, avatarUrl: null }}
  onEdit={(user) => {}}
  onToggleBlock={(user) => {}}
/>
```
Block/Unblock button label and style flip based on `user.blocked`.

#### `CategoryListItem`
```jsx
<CategoryListItem
  category={{ id: 1, name: 'Electronics', icon: '💻', productCount: 42 }}
  onEdit={(cat) => {}}
  onDelete={(cat) => {}}
/>
```

#### `CategoryFormPanel`
```jsx
<CategoryFormPanel
  initialValues={{ name: 'Electronics', icon: '💻', description: 'Devices and gadgets' }}
  onSubmit={(form) => {}}
  onCancel={() => {}}
/>
```
Supports create (no `initialValues`) and edit (with `initialValues`) flows.

---

### 6.11 `overlays/`

#### `Modal`
```jsx
<Modal
  title="Confirm Action"
  onConfirm={() => {}}
  onCancel={() => {}}
  confirmLabel="Confirm"
  variant="default"       // 'default' | 'danger'
>
  <p>Are you sure?</p>
</Modal>
```
Always renders (no `open` prop). Wrap with conditional rendering in the parent. No backdrop click handler.

#### `ConfirmDeleteModal`
```jsx
<ConfirmDeleteModal
  productName="Laptop X"
  onConfirm={() => {}}
  onCancel={() => {}}
/>
```
Always renders. Uses `productName` (not `itemName`).

#### `CheckoutModal`
```jsx
<CheckoutModal
  items={[{ productName: 'Laptop X', quantity: 1, unitPrice: 250000 }]}
  onConfirm={() => {}}
  onCancel={() => {}}
/>
```

#### `ToastContainer` + `useToast`
```jsx
// In a parent component:
const { toasts, show, dismiss } = useToast();

show({ variant: 'success', title: 'Done!', description: 'Order placed.', duration: 3000 });
// variant: 'success' | 'error' | 'warning' | 'info'

<ToastContainer toasts={toasts} onDismiss={dismiss} />
```
`useToast` is exported as a named export from `ToastContainer.jsx`.

#### `SuccessCircle`
```jsx
<SuccessCircle />  // animated checkmark used on order confirmation screens
```

---

## 7. Test Infrastructure

### Setup
- Runner: Vitest 5 with `globals: true`
- DOM: `happy-dom` (jsdom has ESM incompatibility with `@exodus/bytes` on this setup)
- Setup file: `src/test/setup.js` — imports `@testing-library/jest-dom`
- Config: `vite.config.js` → `test.setupFiles: ['./src/test/setup.js']`

### Test location convention
```
src/tests/{module}/{ComponentName}/{ComponentName}.test.jsx
```
Import path from test file to component (3 levels up):
```js
import Button from '../../../components/primitives/Button/Button';
```

### Coverage
51 test files covering all components. Run with:
```bash
npm run test
```

---

## 8. Key Patterns & Gotchas

### Controlled vs Uncontrolled
`QuantityStepper`, `StarSelector`, and `FilterSidebar` support both modes:
- **Controlled**: parent passes `value` prop → component mirrors parent state
- **Uncontrolled**: parent omits `value` → component owns internal state via `useState`
- Detection: `const isControlled = externalValue !== undefined`

### Price Formatting
All price display uses Argentine locale:
```js
price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
```

### Product Types
Products have `type: 'PHYSICAL' | 'SERVICE'`:
- `PHYSICAL` products can go out of stock; `SERVICE` products never do
- `SERVICE` products may have `minutesDuration` instead of `stock`

### OrderStatusAction Transitions
```
PENDING → PAID → SHIPPED → DELIVERED (terminal)
                           CANCELLED  (terminal)
```
Both `DELIVERED` and `CANCELLED` render a disabled `Final state` button (not null/nothing).

### Modal Rendering
`Modal` and `ConfirmDeleteModal` always render when mounted. There is no `open` prop. Control visibility from the parent:
```jsx
{showModal && <ConfirmDeleteModal ... />}
```

### Navbar Admin Badge
Admin badge text is `ADMIN` (all caps). Regular signed-in user shows `user.firstName` (not full name).

### ReviewCard Owner Controls
Edit button text is `✏️ Edit` (with emoji). Delete button is `🗑️ Delete`.
The `isOwner` prop gates both buttons.

### AuthCard — Multiple "Sign In" Elements
The `AuthCard` renders `Sign In` as both a tab button and a form submit button. When testing, use `getAllByText('Sign In')` instead of `getByText`.

### StatCard vs AdminStatsBar
- `StatCard` (in `user/`) takes `value`, `label`, `color` only
- `AdminStatsBar` (in `admin/`) takes an array of `{ icon, value, label, trend? }` objects and renders its own stat cards internally — it does NOT use `StatCard`

---

## 9. Networking Layer

### Structure
```
src/services/
  api/
    client.js       ← generic HTTP client (fetch wrapper, JWT, error handling)
    endpoints.js    ← API path constants grouped by entity
```

Future domain services (authService, productService, etc.) should import from `client.js` and `endpoints.js`.

### `client.js` exports

| Export | Description |
|---|---|
| `http.get(path, options?)` | GET request |
| `http.post(path, body, options?)` | POST request |
| `http.put(path, body, options?)` | PUT request |
| `http.patch(path, body, options?)` | PATCH request |
| `http.delete(path, options?)` | DELETE request |
| `ApiError` | Structured error — `.status` (HTTP code), `.data` (server JSON body), `.message` |
| `getToken()` | Read JWT from localStorage |
| `setToken(token)` | Store JWT in localStorage |
| `clearToken()` | Remove JWT (call on logout) |

`options` object accepted by all `http.*` methods:
```js
{
  params: { userId: 1, page: 0 }, // appended as ?userId=1&page=0
  auth: false,                     // skip Authorization header (default: true)
}
```

### Usage example
```js
import { http, ApiError, setToken, clearToken } from '../services/api/client';
import { AUTH, PRODUCTS } from '../services/api/endpoints';

// Public request — no token
const products = await http.get(PRODUCTS.BASE, { auth: false });

// Authenticated request with query params
const cart = await http.get(CART.BASE, { params: { userId: 42 } });

// POST with body
const { token, user } = await http.post(AUTH.LOGIN, { email, password }, { auth: false });
setToken(token);

// Error handling
try {
  await http.delete(PRODUCTS.BY_ID(5));
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status, err.message, err.data);
  }
}
```

---

## 10. Backend Integration Notes

The following data shapes are assumed from the API (not yet implemented):

| Entity | Key fields |
|---|---|
| User | `id`, `firstName`, `lastName`, `email`, `role`, `isEnabled`, `blocked` |
| Product | `id`, `name`, `price`, `type`, `stock`, `category`, `images[]`, `averageRating`, `reviewCount`, `minutesDuration?`, `seller?` |
| Cart item | `productId`, `productName`, `productCategory`, `quantity`, `unitPrice`, `subtotal?`, `imageUrl?` |
| Order | `id`, `date`, `status`, `items[]`, `total` |
| Review | `id`, `rating`, `comment`, `reviewDate`, `firstName`, `lastName` |
| Category | `id`, `name`, `icon`, `productCount` |

Order statuses: `PENDING` | `PAID` | `SHIPPED` | `DELIVERED` | `CANCELLED`
Product types: `PHYSICAL` | `SERVICE`
