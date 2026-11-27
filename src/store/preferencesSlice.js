import { createSlice } from '@reduxjs/toolkit';

// Preferencias de la interfaz. No son datos sensibles, por eso pueden vivir en localStorage
// y sobrevivir tanto a un F5 como a cerrar el navegador.
export const THEMES = ['light', 'dark'];

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: { theme: 'light' },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, { payload: theme }) => {
      // Si llega un valor desconocido se deja el que estaba.
      if (THEMES.includes(theme)) state.theme = theme;
    },
  },
});

export const { toggleTheme, setTheme } = preferencesSlice.actions;

export const selectTheme = (state) => state.preferences.theme;

export default preferencesSlice.reducer;
