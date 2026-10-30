import { createSlice } from '@reduxjs/toolkit';

// Lista de favoritos del usuario. Vive solo en el front: el backend no expone /favorites.
// Cada item guarda lo mínimo para mostrarlo sin volver a pedir el producto:
// { id, name, price, category, imageUrl }
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [] },
  reducers: {
    // Si el producto no está lo agrega; si ya está lo quita (botón ♡ / ♥).
    toggleFavorite: (state, { payload: product }) => {
      const index = state.items.findIndex((item) => item.id === product.id);
      if (index === -1) state.items.push(product);
      else state.items.splice(index, 1);
    },
    removeFavorite: (state, { payload: id }) => {
      state.items = state.items.filter((item) => item.id !== id);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

// Selectores: los componentes leen el estado solo a través de estas funciones.
export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesCount = (state) => state.favorites.items.length;
export const selectIsFavorite = (id) => (state) =>
  state.favorites.items.some((item) => item.id === id);

export default favoritesSlice.reducer;
