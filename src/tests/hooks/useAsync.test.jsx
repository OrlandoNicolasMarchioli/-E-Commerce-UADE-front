import { act, renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../../hooks/useAsync';

describe('useAsync', () => {
  it('empieza cargando y después expone los datos', async () => {
    const fn = vi.fn().mockResolvedValue(['a', 'b']);
    const { result } = renderHook(() => useAsync(fn));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(['a', 'b']);
    expect(result.current.error).toBeNull();
  });

  it('expone el error si la función falla', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useAsync(fn));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error.message).toBe('boom');
    expect(result.current.data).toBeNull();
  });

  it('reload vuelve a ejecutar la función', async () => {
    const fn = vi.fn().mockResolvedValueOnce('uno').mockResolvedValueOnce('dos');
    const { result } = renderHook(() => useAsync(fn));
    await waitFor(() => expect(result.current.data).toBe('uno'));
    act(() => result.current.reload());
    await waitFor(() => expect(result.current.data).toBe('dos'));
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('ignora la respuesta si el componente se desmontó', async () => {
    let resolve;
    const fn = vi.fn(() => new Promise((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => useAsync(fn));
    unmount();
    await act(async () => resolve('tarde'));
    expect(result.current.data).toBeNull();
  });
});

describe('useAsync · cambio de consulta', () => {
  it('al cambiar la función vuelve a estar cargando y no muestra los datos de la anterior', async () => {
    let resolveSecond;
    const first = vi.fn().mockResolvedValue('A');
    const second = vi.fn(() => new Promise((r) => { resolveSecond = r; }));
    const { result, rerender } = renderHook(({ fn }) => useAsync(fn), { initialProps: { fn: first } });
    await waitFor(() => expect(result.current.data).toBe('A'));

    rerender({ fn: second });
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await act(async () => resolveSecond('B'));
    expect(result.current.data).toBe('B');
    expect(result.current.loading).toBe(false);
  });
});
