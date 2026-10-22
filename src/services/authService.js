import { getJson } from './api/mockClient';
import { ApiError } from './api/client';
import { readMockState, writeMockState } from './mockStorage';

const REGISTERED_KEY = 'uade_mock_registered_users';

async function getMockUsers() {
  // La lista inicial se consume desde /public/data/users.json (UserResponseDTO).
  const users = await getJson('users');
  return [...users, ...readMockState(REGISTERED_KEY, [])];
}

export async function loginRequest(email, password) {
  // DEMO: el JSON no contiene contraseñas. No hay autenticación real ni JWT.
  // Solo se exige una contraseña no vacía y un correo existente en el mock.
  if (!password?.trim()) throw new ApiError(400, 'Ingresá una contraseña para la demostración');
  const users = await getMockUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || !user.isEnabled) throw new ApiError(401, 'No hay un usuario de prueba con ese email');
  // Mantiene la forma de AuthResponseDTO, pero el token es un marcador NO utilizable.
  return { token: 'MOCK_ONLY_NO_JWT', user };
}

export async function registerRequest({ firstName, lastName, email, password, regNumber }) {
  // Simulación: guarda el usuario en el navegador sin persistir contraseñas.
  if (![firstName, lastName, email, password, regNumber].every((value) => String(value ?? '').trim())) {
    throw new ApiError(400, 'Completá los campos obligatorios');
  }
  const users = await getMockUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
    throw new ApiError(409, 'El email ya existe');
  }
  const user = {
    id: Math.max(0, ...users.map((item) => item.id)) + 1,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    regNumber: regNumber.trim(),
    registrationDate: new Date().toISOString().slice(0, 19),
    isEnabled: true,
  };
  writeMockState(REGISTERED_KEY, [...readMockState(REGISTERED_KEY, []), user]);
  // El objeto user tiene exactamente las claves de UserResponseDTO.
  return { token: 'MOCK_ONLY_NO_JWT', user };
}