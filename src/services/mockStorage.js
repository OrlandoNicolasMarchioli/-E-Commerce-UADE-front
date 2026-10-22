// Helper para los cambios simulados: los JSON de /public/data/ son de solo lectura.
// localStorage conserva las operaciones del navegador durante la demostración.
export const readMockState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    // Si el almacenamiento está corrupto, volvemos al JSON original.
    return fallback;
  }
};

export const writeMockState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

// Fecha y hora local sin zona, como LocalDateTime.now() en el back.
// toISOString() da la hora UTC: en Argentina quedaba 3 horas adelantada.
export const localDateTimeNow = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
};