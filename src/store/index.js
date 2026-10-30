import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import { readMockState, writeMockState } from '../services/mockStorage';

export const FAVORITES_KEY = 'uade_mock_favorites';

// Crea un store nuevo. La app usa uno solo; los tests crean uno por caso para arrancar limpios.
export function makeStore() {
  const saved = readMockState(FAVORITES_KEY, []);
  const store = configureStore({
    reducer: { favorites: favoritesReducer },
    // Los favoritos guardados en el navegador sobreviven a una recarga de la página.
    preloadedState: { favorites: { items: Array.isArray(saved) ? saved : [] } },
  });

  // Los reducers deben ser funciones puras, por eso el guardado en localStorage va acá.
  let lastItems = store.getState().favorites.items;
  store.subscribe(() => {
    const { items } = store.getState().favorites;
    if (items !== lastItems) lastItems = writeMockState(FAVORITES_KEY, items);
  });

  return store;
}

export const store = makeStore();
