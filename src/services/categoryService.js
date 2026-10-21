import { getJson } from './api/mockClient';
import { ApiError } from './api/client';

/** GET /api/category --> lista de CategoryResponseDTO. */
export async function getCategories() {
  return getJson('category');
}

/** GET /api/category/{id} --> CategoryResponseDTO. Lanza ApiError 404 si no existe. */
export async function getCategoryById(id) {
  const categories = await getJson('category');
  const category = categories.find((c) => c.id === Number(id));
  if (!category) throw new ApiError(404, `Categoría ${id} no encontrada`);
  return category;
}
