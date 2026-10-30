import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import FavoriteButton from '../../../components/favorites/FavoriteButton/FavoriteButton';
import { makeStore } from '../../../store';
import { selectFavorites } from '../../../store/favoritesSlice';

const product = { id: 7, name: 'Auriculares', price: 25000, category: { id: 1, name: 'Tecnología' } };

const renderWithStore = () => {
  const store = makeStore();
  render(<Provider store={store}><FavoriteButton product={product} imageUrl="img.png" /></Provider>);
  return store;
};

beforeEach(() => localStorage.clear());

describe('FavoriteButton', () => {
  it('arranca sin marcar', () => {
    renderWithStore();
    const button = screen.getByRole('button', { name: /Agregar a favoritos/ });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('al hacer click guarda el producto en el store y cambia el texto', () => {
    const store = renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: /Agregar a favoritos/ }));
    expect(screen.getByRole('button', { name: /En favoritos/ })).toHaveAttribute('aria-pressed', 'true');
    expect(selectFavorites(store.getState())).toEqual([
      { id: 7, name: 'Auriculares', price: 25000, category: 'Tecnología', imageUrl: 'img.png' },
    ]);
  });

  it('un segundo click lo quita de favoritos', () => {
    const store = renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: /Agregar a favoritos/ }));
    fireEvent.click(screen.getByRole('button', { name: /En favoritos/ }));
    expect(screen.getByRole('button', { name: /Agregar a favoritos/ })).toBeInTheDocument();
    expect(selectFavorites(store.getState())).toEqual([]);
  });
});
