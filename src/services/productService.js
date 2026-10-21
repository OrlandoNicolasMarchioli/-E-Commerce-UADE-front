import { getJson } from './api/mockClient';
import { ApiError } from './api/client';
import { getReviewsWithAuthors } from './reviewService';

/** GET /api/products → lista de ProductResponseDTO. */
export async function getProducts() {
  return getJson('products');
}

/** GET /api/products/{id} → ProductResponseDTO. Lanza ApiError 404 si no existe. */
export async function getProductById(id) {
  const products = await getJson('products');
  const product = products.find((p) => p.id === Number(id));
  if (!product) throw new ApiError(404, `Producto ${id} no encontrado`);
  return product;
}

/** GET /api/products/category/{categoryId} → productos de esa categoría. */
export async function getProductsByCategory(categoryId) {
  const products = await getJson('products');
  return products.filter((p) => p.category.id === Number(categoryId));
}

/**
 * GET /api/products/{productId}/images → imágenes del producto, ordenadas por imageOrder.
 * El JSON trae todas las imágenes juntas, por eso se filtra por productId.
 */
export async function getProductImages(productId) {
  const images = await getJson('images');
  return images
    .filter((img) => img.productId === Number(productId))
    .sort((a, b) => a.imageOrder - b.imageOrder);
}

/**
 * Productos listos para mostrar en una ProductCard: cada uno trae sus imágenes
 * (ordenadas), su puntaje promedio y la cantidad de reseñas.
 * Es una vista armada en el front a partir de /products, /images y /reviews;
 * `averageRating` es null si el producto todavía no tiene reseñas.
 */
export async function getProductsWithDetails() {
  const [products, images, reviews] = await Promise.all([
    getJson('products'),
    getJson('images'),
    getJson('reviews'),
  ]);

  return products.map((product) => {
    const productReviews = reviews.filter((r) => r.productId === product.id);
    const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      ...product,
      images: images
        .filter((img) => img.productId === product.id)
        .sort((a, b) => a.imageOrder - b.imageOrder),
      reviewCount: productReviews.length,
      averageRating: productReviews.length ? Math.round((total / productReviews.length) * 10) / 10 : null,
    };
  });
}

/** Productos destacados del Home: los mejor puntuados (y con más reseñas), hasta `limit`. */
export async function getFeaturedProducts(limit = 8) {
  const products = await getProductsWithDetails();
  return products
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0) || b.reviewCount - a.reviewCount || a.id - b.id)
    .slice(0, limit);
}

/**
 * Todo lo que necesita la pantalla de detalle: producto, imágenes, reseñas con autor y vendedor.
 * Lanza ApiError 404 si el producto no existe. Si no se encuentra al vendedor, `seller` es null.
 */
export async function getProductDetail(id) {
  const product = await getProductById(id);
  const [images, reviews, users] = await Promise.all([
    getProductImages(product.id),
    getReviewsWithAuthors(product.id),
    getJson('users').catch(() => []),
  ]);
  const seller = users.find((u) => u.id === product.publisherId) ?? null;
  return { product, images, reviews, seller };
}
