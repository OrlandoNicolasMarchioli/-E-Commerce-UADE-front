# 02 – Matriz de Cobertura

> Cada endpoint del backend aparece al menos una vez.  
> `⚠️` = endpoint sin pantalla dedicada (cubierto inline).

## Tabla: Caso de Uso → Pantalla → Componentes → Endpoint(s)

| CU# | Caso de Uso | Pantalla | Componentes clave | Endpoint(s) |
|-----|-------------|----------|-------------------|-------------|
| CU-01 | Registro de usuario | `/register` – RegisterPage | RegisterForm, Input, Button, Toast | `POST /api/auth/register` |
| CU-02 | Login | `/login` – LoginPage | LoginForm, Input, Button, Toast | `POST /api/auth/login` |
| CU-03 | Logout | Cualquier pantalla (Navbar) | Navbar → botón logout | (client-side: borrar token) |
| CU-04 | Ver home / catálogo | `/` – HomePage | Navbar, HeroBanner, CategoryBar, ProductGrid, ProductCard, Footer | `GET /api/products` · `GET /api/category` |
| CU-05 | Filtrar por categoría | `/` o `/search` | CategoryBar, ProductGrid, ProductCard | `GET /api/products/category/{id}` · `GET /api/category` |
| CU-06 | Buscar productos (keyword) | `/search?q=…` – SearchPage | SearchBar (en Navbar), FilterSidebar, SortDropdown, ProductGrid, ProductCard | `GET /api/products` (filtrado client-side — Gap G2) |
| CU-07 | Ver detalle de producto | `/products/{id}` – ProductDetailPage | ProductGallery, ProductInfo, BuyPanel, ReviewList, ReviewForm, Badge, Rating | `GET /api/products/{id}` · `GET /api/products/{id}/images` · `GET /api/products/{id}/reviews` |
| CU-08 | Agregar al carrito | `/products/{id}` → BuyPanel | BuyPanel → CartButton | `POST /api/cart/items?userId={id}` |
| CU-09 | Ver carrito | `/cart` – CartPage | CartItemList, CartItem, OrderSummary, CheckoutButton | `GET /api/cart?userId={id}` |
| CU-10 | Eliminar item del carrito | `/cart` | CartItem → botón eliminar | `DELETE /api/cart/items/{productId}?userId={id}` |
| CU-11 | Vaciar carrito | `/cart` | CartPage → botón vaciar | `DELETE /api/cart?userId={id}` |
| CU-12 | Confirmar compra (checkout) | `/cart` → `/orders/{id}` | CheckoutButton, Modal confirmación, Toast | `POST /api/orders?userId={id}` |
| CU-13 | Ver mis compras | `/my-orders` – MyOrdersPage | MyOrders, OrderCard, Badge (status), Pagination | `GET /api/orders?userId={id}` |
| CU-14 | Ver detalle de compra | `/my-orders/{id}` – OrderDetailPage | OrderDetail, OrderItemList, Badge (status), Button cancelar | `GET /api/orders/{id}?userId={id}` |
| CU-15 | Cancelar compra | `/my-orders/{id}` | OrderDetail → botón cancelar (visible si PENDING/PAID) | `PUT /api/orders/{id}/status?userId={id}` body `{status:"CANCELLED"}` |
| CU-16 | Ver mi perfil | `/profile` – ProfilePage | ProfileForm, Input, Button, Avatar | `GET /api/users/{id}` |
| CU-17 | Editar mi perfil | `/profile` | ProfileForm → submit | `PUT /api/users/{id}` |
| CU-18 | Publicar producto (ADMIN) | `/admin/products/new` – ProductFormPage | ProductForm, Input, Select (category), ImageUploader, Button | `POST /api/products?publisherId={id}` · `GET /api/category` |
| CU-19 | Editar producto (ADMIN) | `/admin/products/{id}/edit` | ProductForm (modo edición), ImageUploader | `PUT /api/products/{id}` · `GET /api/category` |
| CU-20 | Eliminar producto (ADMIN) | `/admin/products` | MyProducts → botón eliminar, Modal confirmación | `DELETE /api/products/{id}` |
| CU-21 | Gestionar imágenes de producto (ADMIN) | `/admin/products/{id}/edit` | ImageUploader, ProductImageList | `GET /api/products/{id}/images` · `POST /api/products/{id}/images` · `DELETE /api/products/{id}/images/{imageId}` |
| CU-22 | Mis publicaciones (ADMIN) | `/admin/products` – MyProductsPage | MyProducts, ProductRow, Badge, Pagination | `GET /api/products` (filtrado client-side por publisherId — Gap G4) |
| CU-23 | Gestionar categorías (ADMIN) | `/admin/categories` – CategoriesAdminPage | CategoryList, CategoryForm, Modal | `GET /api/category` · `POST /api/category` · `PUT /api/category/{id}` · `DELETE /api/category/{id}` |
| CU-24 | Ver todos los usuarios (ADMIN) | `/admin/users` – UsersAdminPage | UserTable, Badge, Pagination | `GET /api/users` |
| CU-25 | Eliminar usuario (ADMIN) | `/admin/users` | UserTable → botón eliminar | `DELETE /api/users/{id}` |
| CU-26 | Escribir reseña | `/products/{id}` → ReviewForm | ReviewForm, Rating, Input, Button | `POST /api/products/{id}/reviews?userId={id}` |
| CU-27 | Editar reseña propia | `/products/{id}` → ReviewItem | ReviewItem → editar inline | `PUT /api/products/{id}/reviews/{reviewId}` |
| CU-28 | Eliminar reseña propia | `/products/{id}` → ReviewItem | ReviewItem → botón eliminar | `DELETE /api/products/{id}/reviews/{reviewId}` |
| CU-29 | Ver detalle de categoría | `/` o Navbar | CategoryBar | `GET /api/category/{id}` |
| CU-30 | Actualizar estado pedido (ADMIN) | `/admin/orders` o modal | OrderStatusForm, Select | `PUT /api/orders/{id}/status?userId={id}` |

---

## Endpoints sin pantalla dedicada (cubiertos inline)

| Endpoint | Pantalla que lo consume | Motivo |
|----------|------------------------|--------|
| `GET /api/category/{id}` | HomePage / SearchPage | Consumido al seleccionar categoría |
| `GET /api/products/{id}/reviews/{reviewId}` | ProductDetailPage | Detalle individual inline |
| `GET /api/users` | AdminUsersPage | Panel admin |

---

## Checklist de cobertura de endpoints (33/33)

- [x] `POST /api/auth/register` → CU-01
- [x] `POST /api/auth/login` → CU-02
- [x] `GET /api/users` → CU-24
- [x] `GET /api/users/{id}` → CU-16
- [x] `PUT /api/users/{id}` → CU-17
- [x] `DELETE /api/users/{id}` → CU-25
- [x] `GET /api/category` → CU-04, CU-05, CU-18, CU-23
- [x] `GET /api/category/{id}` → CU-29
- [x] `POST /api/category` → CU-23
- [x] `PUT /api/category/{id}` → CU-23
- [x] `DELETE /api/category/{id}` → CU-23
- [x] `GET /api/products` → CU-04, CU-06, CU-22
- [x] `GET /api/products/{id}` → CU-07
- [x] `GET /api/products/category/{categoryId}` → CU-05
- [x] `POST /api/products` → CU-18
- [x] `PUT /api/products/{id}` → CU-19
- [x] `DELETE /api/products/{id}` → CU-20
- [x] `GET /api/products/{productId}/images` → CU-07, CU-21
- [x] `POST /api/products/{productId}/images` → CU-21
- [x] `DELETE /api/products/{productId}/images/{imageId}` → CU-21
- [x] `GET /api/products/{productId}/reviews` → CU-07
- [x] `GET /api/products/{productId}/reviews/{reviewId}` → CU-07 (inline)
- [x] `POST /api/products/{productId}/reviews` → CU-26
- [x] `PUT /api/products/{productId}/reviews/{reviewId}` → CU-27
- [x] `DELETE /api/products/{productId}/reviews/{reviewId}` → CU-28
- [x] `GET /api/cart` → CU-09
- [x] `POST /api/cart/items` → CU-08
- [x] `DELETE /api/cart/items/{productId}` → CU-10
- [x] `DELETE /api/cart` → CU-11
- [x] `POST /api/orders` → CU-12
- [x] `GET /api/orders` → CU-13
- [x] `GET /api/orders/{id}` → CU-14
- [x] `PUT /api/orders/{id}/status` → CU-15, CU-30

**Cobertura total: 33/33 ✅**
