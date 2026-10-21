import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearMockCache, getJson } from '../../services/api/mockClient';
import {
  ApiError,
  getCategories,
  getCategoryById,
  getFeaturedProducts,
  getProductById,
  getProductDetail,
  getReviewsWithAuthors,
  getUserById,
  getUsers,
  getProductImages,
  getProducts,
  getProductsWithDetails,
  getProductsByCategory,
  getReviewsByProduct,
} from '../../services';

// fetch simulado: sirve los archivos reales de /public/data/, así los tests
// también validan que los JSON existan y tengan el formato esperado.
const serveFromDisk = async (url) => {
  const file = resolve(process.cwd(), 'public', url.replace(/^\//, ''));
  if (!existsSync(file)) return { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => JSON.parse(readFileSync(file, 'utf-8')) };
};
const fetchMock = vi.fn(serveFromDisk);

beforeEach(() => {
  clearMockCache();
  fetchMock.mockClear();
  fetchMock.mockImplementation(serveFromDisk); // deshace overrides de tests anteriores
  vi.stubGlobal('fetch', fetchMock);
});

describe('mockClient', () => {
  it('descarga cada archivo una sola vez aunque se pida varias veces', async () => {
    await Promise.all([getJson('products'), getJson('products'), getJson('products')]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/data/products.json');
  });

  it('lanza ApiError 404 si el archivo no existe y permite reintentar', async () => {
    await expect(getJson('inexistente')).rejects.toMatchObject({ name: 'ApiError', status: 404 });
    await expect(getJson('inexistente')).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('productService', () => {
  it('getProducts devuelve el listado completo', async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it('getProductById acepta id numérico o string (viene de la URL)', async () => {
    const byNumber = await getProductById(1);
    const byString = await getProductById('1');
    expect(byNumber.id).toBe(1);
    expect(byString).toEqual(byNumber);
  });

  it('getProductById lanza 404 si no existe', async () => {
    await expect(getProductById(9999)).rejects.toMatchObject({ status: 404 });
  });

  it('getProductsByCategory devuelve solo productos de esa categoría', async () => {
    const result = await getProductsByCategory(4);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category.id === 4)).toBe(true);
  });

  it('getProductImages filtra por producto y ordena por imageOrder', async () => {
    const images = await getProductImages(1);
    expect(images.length).toBeGreaterThan(1);
    expect(images.every((i) => i.productId === 1)).toBe(true);
    expect(images.map((i) => i.imageOrder)).toEqual([...images.map((i) => i.imageOrder)].sort((a, b) => a - b));
  });
});

describe('vistas enriquecidas para las cards', () => {
  it('getProductsWithDetails agrega imágenes ordenadas, puntaje promedio y cantidad de reseñas', async () => {
    const products = await getProductsWithDetails();
    const reviews = await getJson('reviews');
    expect(products).toHaveLength((await getProducts()).length);

    const first = products.find((p) => p.id === 1);
    const firstReviews = reviews.filter((r) => r.productId === 1);
    const expectedAvg = firstReviews.reduce((s, r) => s + r.rating, 0) / firstReviews.length;
    expect(first.reviewCount).toBe(firstReviews.length);
    expect(first.averageRating).toBeCloseTo(expectedAvg, 1);
    expect(first.images.map((i) => i.imageOrder)).toEqual([...first.images.map((i) => i.imageOrder)].sort((a, b) => a - b));
  });

  it('un producto sin reseñas tiene averageRating null y reviewCount 0', async () => {
    const products = await getProductsWithDetails();
    const withoutReviews = products.find((p) => p.id === 4);
    expect(withoutReviews.reviewCount).toBe(0);
    expect(withoutReviews.averageRating).toBeNull();
  });

  it('getFeaturedProducts respeta el límite y ordena por puntaje descendente', async () => {
    const featured = await getFeaturedProducts(5);
    expect(featured).toHaveLength(5);
    const ratings = featured.map((p) => p.averageRating ?? 0);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });
});

describe('detalle de producto y usuarios', () => {
  it('getProductDetail junta producto, imágenes, reseñas con autor y vendedor', async () => {
    const detail = await getProductDetail('1');
    expect(detail.product.id).toBe(1);
    expect(detail.images.length).toBeGreaterThan(0);
    expect(detail.reviews.length).toBeGreaterThan(0);
    // el vendedor es el usuario cuyo id coincide con publisherId (sin depender de los nombres del JSON)
    const users = await getUsers();
    expect(detail.seller).toEqual(users.find((u) => u.id === detail.product.publisherId));
  });

  it('getProductDetail lanza 404 si el producto no existe', async () => {
    await expect(getProductDetail(9999)).rejects.toMatchObject({ status: 404 });
  });

  it('getReviewsWithAuthors agrega nombre del autor y reviewDate', async () => {
    const [first] = await getReviewsWithAuthors(1);
    expect(first.firstName).toBeTruthy();
    expect(first.reviewDate).toBe(first.date);
  });

  it('getReviewsWithAuthors usa un autor genérico si no se puede leer users.json', async () => {
    const real = fetchMock.getMockImplementation();
    fetchMock.mockImplementation(async (url) => (String(url).endsWith('users.json') ? { ok: false, status: 404, json: async () => ({}) } : real(url)));
    const [first] = await getReviewsWithAuthors(1);
    expect(first.firstName).toBe('Usuario');
  });

  it('getUsers y getUserById', async () => {
    expect((await getUsers()).length).toBeGreaterThan(0);
    expect((await getUserById('2')).id).toBe(2);
    await expect(getUserById(9999)).rejects.toMatchObject({ status: 404 });
  });

  it('todas las reseñas y productos apuntan a usuarios existentes', async () => {
    const ids = new Set((await getUsers()).map((u) => u.id));
    for (const r of await getJson('reviews')) expect(ids.has(r.userId)).toBe(true);
    for (const p of await getProducts()) expect(ids.has(p.publisherId)).toBe(true);
  });
});

describe('categoryService', () => {
  it('getCategories devuelve el listado', async () => {
    expect((await getCategories()).length).toBeGreaterThan(0);
  });

  it('getCategoryById devuelve la categoría o lanza 404', async () => {
    expect((await getCategoryById('2')).id).toBe(2);
    await expect(getCategoryById(9999)).rejects.toMatchObject({ status: 404 });
  });
});

describe('reviewService', () => {
  it('getReviewsByProduct filtra por producto y ordena de más reciente a más antigua', async () => {
    const reviews = await getReviewsByProduct(1);
    expect(reviews.length).toBeGreaterThan(1);
    expect(reviews.every((r) => r.productId === 1)).toBe(true);
    const dates = reviews.map((r) => new Date(r.date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('devuelve lista vacía si el producto no tiene reseñas', async () => {
    expect(await getReviewsByProduct(4)).toEqual([]);
  });
});

// Contrato con el backend: los campos deben ser exactamente los de los *ResponseDTO.
describe('contrato JSON ↔ DTOs del backend', () => {
  const keys = (o) => Object.keys(o).sort();

  it('ProductResponseDTO', async () => {
    const expected = ['id', 'name', 'description', 'price', 'type', 'stock', 'minutesDuration', 'attendanceType', 'category', 'publisherId'].sort();
    for (const p of await getProducts()) {
      expect(keys(p)).toEqual(expected);
      expect(['PHYSICAL', 'SERVICE']).toContain(p.type);
    }
  });

  it('CategoryResponseDTO (suelta y embebida en el producto)', async () => {
    for (const c of await getCategories()) expect(keys(c)).toEqual(['id', 'name']);
    for (const p of await getProducts()) expect(keys(p.category)).toEqual(['id', 'name']);
  });

  it('ProductImageResponseDTO', async () => {
    for (const i of await getJson('images')) expect(keys(i)).toEqual(['id', 'imageOrder', 'productId', 'url']);
  });

  it('UserResponseDTO (sin password, como el back)', async () => {
    for (const u of await getUsers()) {
      expect(keys(u)).toEqual(['email', 'firstName', 'id', 'isEnabled', 'lastName', 'regNumber', 'registrationDate']);
    }
  });

  it('ReviewResponseDTO', async () => {
    for (const r of await getJson('reviews')) {
      expect(keys(r)).toEqual(['comment', 'date', 'id', 'productId', 'rating', 'userId']);
      expect(r.rating).toBeGreaterThanOrEqual(1);
      expect(r.rating).toBeLessThanOrEqual(5);
    }
  });

  it('los productos físicos tienen stock y los servicios no', async () => {
    for (const p of await getProducts()) {
      if (p.type === 'PHYSICAL') expect(p.stock).not.toBeNull();
      else expect(p.stock).toBeNull();
    }
  });

  it('integridad: cada imagen y reseña apunta a un producto existente, y no hay reseñas duplicadas', async () => {
    const ids = new Set((await getProducts()).map((p) => p.id));
    const reviews = await getJson('reviews');
    for (const i of await getJson('images')) expect(ids.has(i.productId)).toBe(true);
    for (const r of reviews) expect(ids.has(r.productId)).toBe(true);
    expect(new Set(reviews.map((r) => `${r.productId}-${r.userId}`)).size).toBe(reviews.length);
  });
});
