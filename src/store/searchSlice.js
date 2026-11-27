import { createSlice } from '@reduxjs/toolkit';

// Última búsqueda hecha desde la navbar. Se guarda en sessionStorage: sobrevive a un F5
// pero se borra al cerrar la pestaña, porque solo tiene sentido durante esa visita.
export const MAX_QUERY_LENGTH = 100;

const searchSlice = createSlice({
  name: 'search',
  initialState: { lastQuery: '' },
  reducers: {
    setLastQuery: (state, { payload }) => {
      state.lastQuery = String(payload ?? '').trim().slice(0, MAX_QUERY_LENGTH);
    },
    clearLastQuery: (state) => {
      state.lastQuery = '';
    },
  },
});

export const { setLastQuery, clearLastQuery } = searchSlice.actions;

export const selectLastQuery = (state) => state.search.lastQuery;

export default searchSlice.reducer;
