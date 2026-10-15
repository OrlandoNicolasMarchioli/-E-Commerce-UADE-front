# 01 – Inventario del Backend

**Base URL:** `http://localhost:8080`  
**CORS:** No hay `@CrossOrigin` en el código; en producción se debe configurar.  
**Auth:** JWT Bearer Token · Header `Authorization: Bearer <token>` · Expiración: `86 400 000 ms` (24 h) · Secret: `ECommerceUADESecretKeyParaJWTMuyLargaYSegura2025`

---

## 1. Tabla de Endpoints

### Auth — `/api/auth`

| # | Método | Ruta | Auth | Rol | Body | Respuesta | Errores |
|---|--------|------|------|-----|------|-----------|---------|
| 1 | POST | `/api/auth/register` | No | – | `RegisterRequestDTO` | `200 AuthResponseDTO` | `409` email duplicado |
| 2 | POST | `/api/auth/login` | No | – | `LoginRequestDTO` | `200 AuthResponseDTO` | `401` credenciales inválidas |

### Users — `/api/users`

| # | Método | Ruta | Auth | Rol | Body | Respuesta | Errores |
|---|--------|------|------|-----|------|-----------|---------|
| 3 | GET | `/api/users` | JWT | ADMIN | – | `200 List<UserResponseDTO>` | `401` `403` |
| 4 | GET | `/api/users/{id}` | JWT | ANY | – | `200 UserResponseDTO` | `404` `401` |
| 5 | PUT | `/api/users/{id}` | JWT | ANY | `UserRequestDTO` | `200 UserResponseDTO` | `404` `401` |
| 6 | DELETE | `/api/users/{id}` | JWT | ANY | – | `204` | `404` `401` |

### Category — `/api/category`

| # | Método | Ruta | Auth | Rol | Body | Respuesta | Errores |
|---|--------|------|------|-----|------|-----------|---------|
| 7 | GET | `/api/category` | No | – | – | `200 List<CategoryResponseDTO>` | – |
| 8 | GET | `/api/category/{id}` | No | – | – | `200 CategoryResponseDTO` | `404` |
| 9 | POST | `/api/category` | JWT | ADMIN | `CategoryRequestDTO` | `200 CategoryResponseDTO` | `401` `403` |
| 10 | PUT | `/api/category/{id}` | JWT | ADMIN | `CategoryRequestDTO` | `200 CategoryResponseDTO` | `404` `401` `403` |
| 11 | DELETE | `/api/category/{id}` | JWT | ADMIN | – | `204` | `404` `401` `403` |

### Products — `/api/products`

| # | Método | Ruta | Auth | Rol | Body / Params | Respuesta | Errores |
|---|--------|------|------|-----|---------------|-----------|---------|
| 12 | GET | `/api/products` | No | – | – | `200 List<ProductResponseDTO>` | – |
| 13 | GET | `/api/products/{id}` | No | – | – | `200 ProductResponseDTO` | `404` |
| 14 | GET | `/api/products/category/{categoryId}` | No | – | – | `200 List<ProductResponseDTO>` | `404` |
| 15 | POST | `/api/products?publisherId={id}` | JWT | ADMIN | `ProductRequestDTO` | `200 ProductResponseDTO` | `400` cat/user not found `401` `403` |
| 16 | PUT | `/api/products/{id}` | JWT | ADMIN | `ProductRequestDTO` | `200 ProductResponseDTO` | `404` `401` `403` |
| 17 | DELETE | `/api/products/{id}` | JWT | ADMIN | – | `204` | `404` `401` `403` |

### Product Images — `/api/products/{productId}/images`

| # | Método | Ruta | Auth | Rol | Body | Respuesta | Errores |
|---|--------|------|------|-----|------|-----------|---------|
| 18 | GET | `/api/products/{productId}/images` | No (anyRequest.permitAll) | – | – | `200 List<ProductImageResponseDTO>` | `404` |
| 19 | POST | `/api/products/{productId}/images` | JWT | ADMIN | `ProductImageRequestDTO` | `201 ProductImageResponseDTO` | `404` `401` `403` |
| 20 | DELETE | `/api/products/{productId}/images/{imageId}` | JWT | ADMIN | – | `204` | `404` `401` `403` |

### Reviews — `/api/products/{productId}/reviews`

| # | Método | Ruta | Auth | Rol | Body / Params | Respuesta | Errores |
|---|--------|------|------|-----|---------------|-----------|---------|
| 21 | GET | `/api/products/{productId}/reviews` | No | – | – | `200 List<ReviewResponseDTO>` | `404` |
| 22 | GET | `/api/products/{productId}/reviews/{reviewId}` | No | – | – | `200 ReviewResponseDTO` | `404` |
| 23 | POST | `/api/products/{productId}/reviews?userId={id}` | JWT | ANY | `ReviewRequestDTO` | `201 ReviewResponseDTO` | `404` prod/user `409` duplicado `401` |
| 24 | PUT | `/api/products/{productId}/reviews/{reviewId}` | JWT | ANY | `ReviewRequestDTO` | `200 ReviewResponseDTO` | `404` `401` |
| 25 | DELETE | `/api/products/{productId}/reviews/{reviewId}` | JWT | ANY | – | `204` | `404` `401` |

### Cart — `/api/cart`

| # | Método | Ruta | Auth | Rol | Body / Params | Respuesta | Errores |
|---|--------|------|------|-----|---------------|-----------|---------|
| 26 | GET | `/api/cart?userId={id}` | JWT | ANY | – | `200 CartResponseDTO` | `401` |
| 27 | POST | `/api/cart/items?userId={id}` | JWT | ANY | `CartItemRequestDTO` | `201 CartResponseDTO` | `404` `409` sin stock `401` |
| 28 | DELETE | `/api/cart/items/{productId}?userId={id}` | JWT | ANY | – | `204` | `401` |
| 29 | DELETE | `/api/cart?userId={id}` | JWT | ANY | – | `204` | `401` |

### Orders — `/api/orders`

| # | Método | Ruta | Auth | Rol | Body / Params | Respuesta | Errores |
|---|--------|------|------|-----|---------------|-----------|---------|
| 30 | POST | `/api/orders?userId={id}` | JWT | ANY | – | `201 OrderResponseDTO` | `400` carrito vacío `409` sin stock `401` |
| 31 | GET | `/api/orders?userId={id}` | JWT | ANY | – | `200 List<OrderResponseDTO>` | `401` |
| 32 | GET | `/api/orders/{id}?userId={id}` | JWT | ANY | – | `200 OrderResponseDTO` | `404` `403` otro usuario `401` |
| 33 | PUT | `/api/orders/{id}/status?userId={id}` | JWT | ADMIN | `OrderStatusRequestDTO` | `200 OrderResponseDTO` | `400` transición inválida `403` `401` |

**Total: 33 endpoints**

---

## 2. Modelo de Datos

### Entidades y Relaciones

```
User (1) ──── (1) Cart
User (1) ──── (N) Order
User (1) ──── (N) Product (publisher)
User (1) ──── (N) Review

Product (N) ──── (1) Category
Product (1) ──── (N) ProductImage
Product (N) ──── (N) CartItem  [a través de CartItem]
Product (1) ──── (N) Review

Order (1) ──── (N) OrderItem
OrderItem (N) ──── (1) Product
Cart (1) ──── (N) CartItem
CartItem (N) ──── (1) Product
```

### Campos por entidad

**User** (`users`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| firstName | String | NOT NULL |
| lastName | String | NOT NULL |
| email | String | NOT NULL, UNIQUE |
| password | String | NOT NULL (bcrypt) |
| regNumber | String | nullable (legajo) |
| registrationDate | LocalDateTime | NOT NULL, default now() |
| isEnabled | boolean | NOT NULL, default true |
| role | Role (enum) | NOT NULL, default USER |

Role values: `USER`, `ADMIN`

**Product** (`products`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| name | String | NOT NULL |
| description | String | nullable |
| price | BigDecimal | NOT NULL, DECIMAL(12,2) |
| type | ProductType (enum) | NOT NULL |
| stock | Integer | nullable (solo PHYSICAL) |
| minutesDuration | Integer | nullable (solo SERVICE) |
| attendanceType | String | nullable (solo SERVICE) |
| category | Category | NOT NULL, FK |
| publisher | User | NOT NULL, FK |

ProductType values: `PHYSICAL`, `SERVICE`

**Category** (`categories`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| name | String | NOT NULL |

**ProductImage** (`product_images`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| url | String | NOT NULL |
| imageOrder | Integer | nullable |
| product | Product | NOT NULL, FK |

**Cart** (`carts`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| user | User | NOT NULL, UNIQUE (1 carrito por usuario) |

**CartItem** (`cart_items`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| cart | Cart | NOT NULL, FK |
| product | Product | NOT NULL, FK |
| quantity | Integer | NOT NULL |

**Order** (`orders`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| user | User | NOT NULL, FK |
| orderDate | LocalDateTime | NOT NULL, default now() |
| status | OrderStatus (enum) | NOT NULL, default PENDING |
| total | BigDecimal | NOT NULL, DECIMAL(12,2) |
| items | List<OrderItem> | CASCADE ALL |

OrderStatus values: `PENDING → PAID → SHIPPED → DELIVERED`, `PENDING/PAID → CANCELLED`

**OrderItem** (`order_items`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| order | Order | NOT NULL, FK |
| product | Product | NOT NULL, FK |
| productName | String | NOT NULL (precio congelado) |
| quantity | Integer | NOT NULL |
| unitPrice | BigDecimal | NOT NULL, DECIMAL(12,2) (precio congelado) |

**Review** (`reviews`)
| Campo | Tipo | Restricción |
|-------|------|-------------|
| id | Long | PK, AUTO |
| rating | Integer | NOT NULL |
| comment | String | nullable |
| date | LocalDateTime | NOT NULL, default now() |
| product | Product | NOT NULL, FK |
| user | User | NOT NULL, FK |
| UNIQUE(product_id, user_id) | | 1 reseña por usuario por producto |

---

## 3. JSON de Ejemplo por Recurso

### AuthResponseDTO
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@test.com",
    "regNumber": "L1",
    "registrationDate": "2026-10-14T10:00:00",
    "isEnabled": true
  }
}
```

### ProductResponseDTO
```json
{
  "id": 1,
  "name": "Notebook Lenovo",
  "description": "Notebook 15 pulgadas, 16GB RAM",
  "price": 950000.00,
  "type": "PHYSICAL",
  "stock": 10,
  "minutesDuration": null,
  "attendanceType": null,
  "category": { "id": 1, "name": "Tecnología" },
  "publisherId": 1
}
```

### CartResponseDTO
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Notebook Lenovo",
      "quantity": 2,
      "unitPrice": 950000.00,
      "subtotal": 1900000.00
    }
  ],
  "total": 1900000.00
}
```

### OrderResponseDTO
```json
{
  "id": 1,
  "userId": 1,
  "orderDate": "2026-10-14T12:30:00",
  "status": "PENDING",
  "items": [
    {
      "productId": 1,
      "productName": "Notebook Lenovo",
      "quantity": 2,
      "unitPrice": 950000.00,
      "subtotal": 1900000.00
    }
  ],
  "total": 1900000.00
}
```

### ReviewResponseDTO
```json
{
  "id": 1,
  "rating": 5,
  "comment": "Excelente producto",
  "date": "2026-10-14T15:00:00",
  "productId": 1,
  "userId": 1
}
```

### ProductImageResponseDTO
```json
{
  "id": 1,
  "url": "https://example.com/images/notebook-1.png",
  "imageOrder": 1,
  "productId": 1
}
```

---

## 4. Mecanismo de Autenticación

- **Tipo:** JWT stateless (no sesión)
- **Header:** `Authorization: Bearer <token>`
- **Expiración:** 86 400 000 ms = **24 horas**
- **Algoritmo:** HMAC-SHA256
- **Payload (subject):** email del usuario
- **Generado en:** `POST /api/auth/register` y `POST /api/auth/login`
- **Validado en:** `JwtAuthenticationFilter` (antes de `UsernamePasswordAuthenticationFilter`)

**Flujo:**
1. Cliente envía credenciales a `/api/auth/login`
2. Back retorna `{ token, user }`
3. Cliente guarda token en `localStorage` / estado global
4. Toda request protegida lleva `Authorization: Bearer <token>`

---

## 5. Validaciones del Backend (para replicar en formularios)

| Campo | Regla | Excepción |
|-------|-------|-----------|
| email (register) | Único en BD | `EmailAlreadyExistsException` → 409 |
| login | email + password válidos | `InvalidCredentialsException` → 401 |
| JWT token | Válido y no expirado | `InvalidJwtTokenException` → 401 |
| product.price | > 0 | `NegativePriceException` |
| product.stock | > 0 (PHYSICAL) | `InvalidQuantityException` |
| cartItem.quantity | > 0 | `InvalidQuantityException` |
| checkout | Carrito no vacío | `EmptyCartException` → 400 |
| checkout | Stock suficiente al momento del checkout | `InsufficientStockException` → 409 |
| review | 1 por usuario por producto (UNIQUE constraint) | `DuplicateReviewException` → 409 |
| order status | Transición válida (máquina de estados) | `InvalidOrderStateException` → 400 |
| order access | `userId` debe ser el dueño del pedido | `OrderAccessDeniedException` → 403 |

---

## 6. URL Base y CORS

- **URL base:** `http://localhost:8080`
- **CORS:** No configurado explícitamente en el código (sin `@CrossOrigin` ni `CorsConfigurationSource`). El front deberá correr en el mismo origin o se debe agregar configuración CORS en el back. **Gap anotado.**
- **Base de datos:** MySQL `localhost:3306/ecommerce_db3` (createDatabaseIfNotExist=true)

---

## 7. Gaps del Backend

| # | Gap | Impacto en Frontend |
|---|-----|---------------------|
| G1 | No hay CORS configurado | El front en `localhost:5173` recibirá errores CORS al llamar al back en `:8080` |
| G2 | `GET /api/products` no tiene filtrado por nombre/texto | No hay endpoint de búsqueda por keyword; el front debe filtrar client-side o implementar búsqueda local |
| G3 | `GET /api/products` no tiene paginación ni ordenamiento por parámetros | El ordenamiento y la paginación deben hacerse client-side |
| G4 | No hay endpoint para obtener "mis publicaciones" por vendedor (salvo filtrar todos los productos por `publisherId`) | `GET /api/products` retorna todos; el front filtra por `publisherId === userId` |
| G5 | `POST /api/products` requiere rol ADMIN para publicar | Un usuario normal (USER) no puede publicar productos. Si el TPO requiere que cualquier usuario venda, hay un gap de diseño en la seguridad |
| G6 | `PUT /api/orders/{id}/status` requiere rol ADMIN | Un comprador no puede cambiar su propio estado de pedido (ej. pagar). Si el flujo requiere que el comprador "pague", hay un gap |
| G7 | No hay endpoint de perfil propio (`/api/users/me`) | El front usa `GET /api/users/{id}` con el id guardado en estado local |
| G8 | `RegisterRequestDTO` no retorna el rol en `AuthResponseDTO` | El front no puede distinguir USER vs ADMIN solo con el token salvo decodificando el JWT |
| G9 | No hay upload de imágenes; `ProductImageRequestDTO.url` es solo una URL string | No hay CDN ni storage; el front envía URLs externas |
