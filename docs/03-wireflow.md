# 03 – Wireflow

> Diagrama de navegación completo. Las rutas marcadas con 🔒 redirigen a `/login` si el usuario no está autenticado. Las marcadas con 👑 requieren rol ADMIN.

## Mapa de Rutas

```
/                       → HomePage          (público)
/login                  → LoginPage         (público; redirect a / si ya logueado)
/register               → RegisterPage      (público; redirect a / si ya logueado)
/search                 → SearchPage        (público)
/products/:id           → ProductDetailPage (público)
/cart                   → CartPage          🔒
/my-orders              → MyOrdersPage      🔒
/my-orders/:id          → OrderDetailPage   🔒
/profile                → ProfilePage       🔒
/admin/products         → MyProductsPage    🔒 👑
/admin/products/new     → ProductFormPage   🔒 👑
/admin/products/:id/edit→ ProductFormPage   🔒 👑
/admin/categories       → CategoriesAdminPage 🔒 👑
/admin/users            → UsersAdminPage    🔒 👑
/design-system          → DesignSystemPage  (público, dev only)
```

---

## Diagrama Mermaid

```mermaid
flowchart TD
    %% ── Punto de entrada ─────────────────────────────────
    START([Usuario abre la app]) --> HOME

    %% ── Home ─────────────────────────────────────────────
    HOME["/\nHomePage\nNavbar · HeroBanner · CategoryBar\nProductGrid · ProductCard · Footer"]

    HOME -- "Click en categoría" --> SEARCH
    HOME -- "Click en producto" --> DETAIL
    HOME -- "Escribe en buscador" --> SEARCH
    HOME -- "Click en 'Ingresar'" --> LOGIN
    HOME -- "Click en 'Registrarse'" --> REGISTER
    HOME -- "Click en carrito 🔒" --> CART_GUARD

    %% ── Auth ─────────────────────────────────────────────
    LOGIN["/login\nLoginPage\nLoginForm · Input · Button · Toast"]
    REGISTER["/register\nRegisterPage\nRegisterForm · Input · Button · Toast"]

    LOGIN -- "Credenciales válidas → JWT guardado" --> HOME
    LOGIN -- "Click en 'Crear cuenta'" --> REGISTER
    REGISTER -- "Registro exitoso → JWT guardado" --> HOME
    REGISTER -- "Click en 'Ya tengo cuenta'" --> LOGIN

    %% ── Guard de autenticación ────────────────────────────
    CART_GUARD{¿Autenticado?}
    CART_GUARD -- "No → redirect" --> LOGIN
    CART_GUARD -- "Sí" --> CART

    %% ── Búsqueda ─────────────────────────────────────────
    SEARCH["/search?q=…\nSearchPage\nFilterSidebar · SortDropdown\nProductGrid · ProductCard"]
    SEARCH -- "Click en producto" --> DETAIL
    SEARCH -- "Cambiar filtros / orden" --> SEARCH

    %% ── Detalle de producto ───────────────────────────────
    DETAIL["/products/:id\nProductDetailPage\nProductGallery · ProductInfo\nBuyPanel · ReviewList · ReviewForm"]
    DETAIL -- "Agregar al carrito 🔒" --> CART_GUARD
    DETAIL -- "Escribir reseña 🔒" --> DETAIL
    DETAIL -- "Editar/Eliminar reseña propia 🔒" --> DETAIL
    DETAIL -- "Click en categoría" --> SEARCH

    %% ── Carrito ───────────────────────────────────────────
    CART["/cart\nCartPage\nCartItemList · CartItem\nOrderSummary · CheckoutButton"]
    CART -- "Eliminar item" --> CART
    CART -- "Vaciar carrito" --> CART
    CART -- "Confirmar compra → Modal" --> CHECKOUT_MODAL

    CHECKOUT_MODAL{Modal de confirmación}
    CHECKOUT_MODAL -- "Cancelar" --> CART
    CHECKOUT_MODAL -- "Confirmar → POST /api/orders" --> ORDER_DETAIL

    %% ── Mis compras ───────────────────────────────────────
    MY_ORDERS["/my-orders\nMyOrdersPage\nOrderCard · Badge · Pagination"]
    ORDER_DETAIL["/my-orders/:id\nOrderDetailPage\nOrderDetail · OrderItemList\nBadge · Button cancelar"]

    MY_ORDERS -- "Click en pedido" --> ORDER_DETAIL
    ORDER_DETAIL -- "Cancelar pedido (PENDING/PAID)" --> ORDER_DETAIL
    ORDER_DETAIL -- "Volver" --> MY_ORDERS

    %% ── Perfil ────────────────────────────────────────────
    PROFILE["/profile\nProfilePage\nProfileForm · Input · Button · Avatar"]
    PROFILE -- "Guardar cambios" --> PROFILE

    %% ── Admin ─────────────────────────────────────────────
    ADMIN_PRODUCTS["/admin/products\nMyProductsPage\nProductRow · Badge · Pagination · Button"]
    PRODUCT_FORM_NEW["/admin/products/new\nProductFormPage\nProductForm · ImageUploader · Select"]
    PRODUCT_FORM_EDIT["/admin/products/:id/edit\nProductFormPage (edición)\nProductForm · ImageUploader"]
    ADMIN_CATS["/admin/categories\nCategoriesAdminPage\nCategoryList · CategoryForm · Modal"]
    ADMIN_USERS["/admin/users\nUsersAdminPage\nUserTable · Badge · Pagination"]

    ADMIN_PRODUCTS -- "Nueva publicación" --> PRODUCT_FORM_NEW
    ADMIN_PRODUCTS -- "Editar producto" --> PRODUCT_FORM_EDIT
    ADMIN_PRODUCTS -- "Eliminar producto → Modal" --> ADMIN_PRODUCTS
    PRODUCT_FORM_NEW -- "Guardar → POST /api/products" --> ADMIN_PRODUCTS
    PRODUCT_FORM_EDIT -- "Guardar → PUT /api/products/:id" --> ADMIN_PRODUCTS

    %% ── Navbar (siempre visible) ──────────────────────────
    NAVBAR[Navbar]
    NAVBAR -- "Logo / Home" --> HOME
    NAVBAR -- "Buscador" --> SEARCH
    NAVBAR -- "Carrito 🔒" --> CART_GUARD
    NAVBAR -- "Mis compras 🔒" --> MY_ORDERS
    NAVBAR -- "Perfil 🔒" --> PROFILE
    NAVBAR -- "Admin 👑" --> ADMIN_PRODUCTS
    NAVBAR -- "Logout" --> HOME

    %% ── Rutas protegidas (guard general) ─────────────────
    MY_ORDERS -. "🔒 No auth → /login" .-> LOGIN
    ORDER_DETAIL -. "🔒 No auth → /login" .-> LOGIN
    PROFILE -. "🔒 No auth → /login" .-> LOGIN
    ADMIN_PRODUCTS -. "🔒👑 No auth/rol → /login" .-> LOGIN
    PRODUCT_FORM_NEW -. "🔒👑 No auth/rol → /login" .-> LOGIN
    PRODUCT_FORM_EDIT -. "🔒👑 No auth/rol → /login" .-> LOGIN
    ADMIN_CATS -. "🔒👑 No auth/rol → /login" .-> LOGIN
    ADMIN_USERS -. "🔒👑 No auth/rol → /login" .-> LOGIN
```

---

## Por pantalla: componentes clave

| Pantalla | Ruta | Componentes |
|----------|------|-------------|
| HomePage | `/` | Navbar, HeroBanner, CategoryBar, ProductGrid, ProductCard, Footer |
| LoginPage | `/login` | LoginForm, Input, Button, Toast, Link |
| RegisterPage | `/register` | RegisterForm, Input, Button, Toast, Link |
| SearchPage | `/search` | Navbar, FilterSidebar, SortDropdown, ProductGrid, ProductCard, Pagination, Footer |
| ProductDetailPage | `/products/:id` | Navbar, ProductGallery, ProductInfo, BuyPanel, Rating, Badge, ReviewList, ReviewForm, ReviewItem, Spinner, Footer |
| CartPage | `/cart` | Navbar, CartItemList, CartItem, OrderSummary, CheckoutButton, Modal, Toast, Footer |
| MyOrdersPage | `/my-orders` | Navbar, OrderCard, Badge, Pagination, Skeleton, Footer |
| OrderDetailPage | `/my-orders/:id` | Navbar, OrderDetail, OrderItemList, Badge, Button, Toast, Footer |
| ProfilePage | `/profile` | Navbar, ProfileForm, Input, Button, Avatar, Toast, Footer |
| MyProductsPage | `/admin/products` | Navbar, ProductRow, Badge, Pagination, Modal, Button, Toast, Footer |
| ProductFormPage | `/admin/products/new` `/admin/products/:id/edit` | Navbar, ProductForm, Input, Select, Checkbox, ImageUploader, ProductImageList, Button, Toast, Spinner, Footer |
| CategoriesAdminPage | `/admin/categories` | Navbar, CategoryList, CategoryForm, Modal, Input, Button, Toast, Footer |
| UsersAdminPage | `/admin/users` | Navbar, UserTable, Badge, Pagination, Button, Modal, Footer |
| DesignSystemPage | `/design-system` | Todos los componentes base en exhibición |

---

## Rutas protegidas y comportamiento

| Tipo de ruta | Guard | Comportamiento |
|-------------|-------|----------------|
| `🔒` Autenticado | `ProtectedRoute` | Redirect a `/login` con `returnTo` en state |
| `👑` Admin | `AdminRoute` | Redirect a `/` con Toast "Sin permisos" |
| Login/Register ya logueado | `GuestRoute` | Redirect a `/` |
