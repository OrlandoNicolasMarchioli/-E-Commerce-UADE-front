import { useCallback, useEffect, useState } from 'react';

/**
 * Ejecuta una función asíncrona al montar (y cada vez que cambia o se llama a reload)
 * y expone su estado.
 * `asyncFn` tiene que ser estable: definila fuera del componente o envolvela en useCallback.
 *
 * @template T
 * @param {() => Promise<T>} asyncFn
 * @returns {{ data: T | null, error: Error | null, loading: boolean, reload: () => void }}
 */
export function useAsync(asyncFn) {
  const [attempt, setAttempt] = useState(0);
  // El resultado guarda a qué consulta pertenece (función + intento). Si no coincide con la actual,
  // todavía estamos esperando: así no se muestran datos viejos cuando cambia el id o se reintenta.
  const [result, setResult] = useState({ asyncFn: null, attempt: -1, data: null, error: null });

  useEffect(() => {
    let cancelled = false; // evita actualizar el estado si el componente se desmontó o cambió la consulta
    asyncFn()
      .then((data) => !cancelled && setResult({ asyncFn, attempt, data, error: null }))
      .catch((error) => !cancelled && setResult({ asyncFn, attempt, data: null, error }));
    return () => {
      cancelled = true;
    };
  }, [asyncFn, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const current = result.asyncFn === asyncFn && result.attempt === attempt;
  return {
    data: current ? result.data : null,
    error: current ? result.error : null,
    loading: !current,
    reload,
  };
}
