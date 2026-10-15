# UADE E-Commerce — Frontend

> **Aplicaciones Interactivas · 2C-2026 · Universidad Argentina de la Empresa**
>
> Proyecto integrador inspirado en Mercado Libre. Marketplace universitario con soporte para productos físicos y servicios, carrito, órdenes, reseñas y panel de administración.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)

---

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + JSX |
| Build | Vite 8 |
| Estilos | CSS custom properties (design tokens) |
| Linter | Oxlint |
| Backend | Spring Boot · MySQL 8 · JWT |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview
```

> El backend corre en `http://localhost:8080`. Ver [inventario de endpoints](docs/01-inventario-backend.md).

---

## Documentación del proyecto

| # | Archivo | Descripción |
|---|---|---|
| 01 | [Inventario Backend](docs/01-inventario-backend.md) | 33 endpoints, modelos de datos, DTOs, autenticación JWT, gaps |
| 02 | [Matriz de Cobertura](docs/02-matriz-cobertura.md) | 30 casos de uso × pantallas × componentes × endpoints |
| 03 | [Wireflow](docs/03-wireflow.md) | Diagrama de navegación (Mermaid), rutas públicas/protegidas/admin |
| 04 | [Design System](docs/04-design-system.md) | Tokens de diseño, paleta UADE, tipografía, WCAG AA |

---

## Mockups — 18 pantallas

Todos los mockups son HTML estático que usan únicamente CSS custom properties del design system (sin colores ni tamaños hardcodeados).

| # | Pantalla | Endpoints cubiertos |
|---|---|---|
| [00](docs/mockups/00-tokens.html) | Design System / Token Showcase | — |
| [01](docs/mockups/01-home.html) | Home · HeroBanner · CategoryBar · ProductGrid | `GET /api/products` · `GET /api/category` |
| [02](docs/mockups/02-login-register.html) | Login / Registro | `POST /api/auth/login` · `POST /api/auth/register` |
| [03](docs/mockups/03-search.html) | Búsqueda con filtros y paginación | `GET /api/products` (client-side filter) |
| [04](docs/mockups/04-product-detail.html) | Detalle de producto · Galería · Reseñas | `GET /api/products/{id}` · `GET /api/products/{id}/images` · `GET /api/products/{id}/reviews` |
| [05](docs/mockups/05-cart.html) | Carrito · Checkout modal | `GET /api/cart` · `POST /api/cart/items` · `DELETE /api/cart/items/{id}` |
| [06](docs/mockups/06-my-orders.html) | Mis compras · filtro por estado | `GET /api/orders?userId=` |
| [07](docs/mockups/07-order-detail.html) | Detalle de pedido · Timeline de estados | `GET /api/orders/{id}` · `PUT /api/orders/{id}/status` |
| [08](docs/mockups/08-profile.html) | Perfil · editar datos personales | `GET /api/users/{id}` · `PUT /api/users/{id}` |
| [09](docs/mockups/09-admin-products.html) | Admin · tabla de publicaciones | `GET /api/products` · `DELETE /api/products/{id}` |
| [10](docs/mockups/10-product-form.html) | Admin · formulario crear/editar producto | `POST /api/products` · `PUT /api/products/{id}` · `POST/DELETE /api/products/{id}/images` |
| [11](docs/mockups/11-admin-categories.html) | Admin · CRUD de categorías | `GET/POST/PUT/DELETE /api/category` |
| [12](docs/mockups/12-admin-users.html) | Admin · gestión de usuarios | `GET /api/users` · `DELETE /api/users/{id}` |
| [13](docs/mockups/13-category-results.html) | Resultados por categoría | `GET /api/products/category/{id}` |
| [14](docs/mockups/14-checkout-success.html) | Confirmación de pedido (post-checkout) | `POST /api/orders` → 201 |
| [15](docs/mockups/15-admin-orders.html) | Admin · gestión de pedidos · cambio de estado | `PUT /api/orders/{id}/status` |
| [16](docs/mockups/16-cart-states.html) | Carrito vacío · toast add-to-cart · vaciar carrito | `POST /api/cart/items` · `DELETE /api/cart` |
| [17](docs/mockups/17-review-edit.html) | Editar reseña inline · confirmar eliminar | `PUT /api/products/{id}/reviews/{reviewId}` · `DELETE /api/products/{id}/reviews/{reviewId}` |

---

## Design System

Los tokens están en `src/theme/` y se usan en todos los componentes:

```
src/theme/
├── tokens.css     # CSS custom properties (:root)
├── tokens.json    # Tokens Studio for Figma (compatible)
└── index.js       # Exports JS: color, font, space, radius, shadow, etc.
```

### Importar en un componente

```jsx
// Opción A — CSS custom properties (recomendado)
import '../../theme/tokens.css';
// Usar: var(--color-brand-primary), var(--space-4), etc.

// Opción B — JS tokens
import tokens from '../../theme/index.js';
// Usar: tokens.color.brand.primary
```

### Paleta principal

| Token | Valor | Uso |
|---|---|---|
| `--color-brand-primary` | `#002D62` | Navbar, botones primarios, títulos |
| `--color-brand-secondary` | `#0070C0` | Links, botones secundarios, focus |
| `--color-brand-accent` | `#FFB800` | Botón carrito, búsqueda, highlights |
| `--color-success` | `#059669` | Stock disponible, pedido entregado |
| `--color-error` | `#DC2626` | Errores, sin stock, cancelado |

---

## Backend API

- **Base URL:** `http://localhost:8080/api`
- **Auth:** `Authorization: Bearer <JWT>` · HMAC-SHA256 · 24h expiry
- **Roles:** `USER` · `ADMIN`
- **DB:** MySQL 8 · `ecommerce_db3`

Ver el [inventario completo de endpoints](docs/01-inventario-backend.md) con ejemplos de request/response.

---

## Backend Gaps documentados

Limitaciones actuales del backend que el frontend debe manejar:

| # | Gap | Impacto |
|---|---|---|
| G1 | CORS no configurado | El frontend no puede llamar al backend sin proxy |
| G2 | Sin endpoint de búsqueda por keyword | Filtrado se hace client-side sobre `GET /api/products` |
| G3 | Sin paginación en `GET /api/products` | Todos los productos se traen en una sola llamada |
| G4 | Sin `GET /api/products?publisherId=` | No hay "mis publicaciones" para usuario normal |
| G5 | `POST /api/products` requiere ADMIN | Usuario normal no puede publicar |
| G6 | `PUT /api/orders/{id}/status` requiere ADMIN | Usuario solo puede cancelar, no avanzar estado |
| G7 | Sin `GET /api/users/me` | El frontend debe guardar el userId del token JWT |
| G8 | `UserResponseDTO` no incluye `role` | El frontend debe decodificar el JWT para obtener el rol |
| G9 | Sin `GET /api/orders` global para ADMIN | Admin no puede listar todos los pedidos sin conocer userId |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── ProductCard.jsx
│   └── ProductList.jsx
├── data/
│   └── products.json        # mock data local
├── theme/
│   ├── tokens.css
│   ├── tokens.json
│   └── index.js
├── App.jsx
└── main.jsx
docs/
├── 01-inventario-backend.md
├── 02-matriz-cobertura.md
├── 03-wireflow.md
├── 04-design-system.md
└── mockups/
    └── 00-tokens.html … 17-review-edit.html
```
