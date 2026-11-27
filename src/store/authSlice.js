import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginRequest, registerRequest } from '../services/authService';
import { isTokenExpired } from '../services/mockToken';

// Sesión del usuario. Se persiste con redux-persist (ver store/index.js), pero solo
// token y user: status y error son del momento y no tienen sentido después de un F5.
// Nunca se guarda la contraseña: no entra al estado en ningún momento.

export const login = createAsyncThunk('auth/login', ({ email, password }) =>
  loginRequest(email, password));

export const register = createAsyncThunk('auth/register', (fields) => registerRequest(fields));

const initialState = { token: null, user: null, status: 'idle', error: null };

const startRequest = (state) => {
  state.status = 'loading';
  state.error = null;
};

// La respuesta tiene la forma de AuthResponseDTO: { token, user }.
const saveSession = (state, { payload }) => {
  state.token = payload.token;
  state.user = payload.user;
  state.status = 'succeeded';
  state.error = null;
};

const failRequest = (state, { error }) => {
  state.status = 'failed';
  state.error = error.message ?? 'No se pudo completar la operación';
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Vuelve al estado inicial; redux-persist guarda ese estado vacío y el token desaparece del navegador.
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, startRequest)
      .addCase(login.fulfilled, saveSession)
      .addCase(login.rejected, failRequest)
      .addCase(register.pending, startRequest)
      .addCase(register.fulfilled, saveSession)
      .addCase(register.rejected, failRequest);
  },
});

export const { logout } = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;

// Con un token vencido la sesión no cuenta, aunque el usuario siga en el estado.
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth.user && state.auth.token && !isTokenExpired(state.auth.token));

export default authSlice.reducer;
