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