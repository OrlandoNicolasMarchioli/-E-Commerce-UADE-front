import { getJson } from './api/mockClient';
import { ApiError } from './api/client';

/** GET /api/users → lista de UserResponseDTO (solo ADMIN en el back). */
export async function getUsers() {
  return getJson('users');
}

/** GET /api/users/{id} → UserResponseDTO. Lanza ApiError 404 si no existe. */
export async function getUserById(id) {
  const users = await getJson('users');
  const user = users.find((u) => u.id === Number(id));
  if (!user) throw new ApiError(404, `Usuario ${id} no encontrado`);
  return user;
}
