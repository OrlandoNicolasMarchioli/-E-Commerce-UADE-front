import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import favoritesReducer from './favoritesSlice';
import authReducer, { logout } from './authSlice';
import { readMockState, writeMockState } from '../services/mockStorage';
import { isTokenExpired } from '../services/mockToken';

export const FAVORITES_KEY = 'uade_mock_favorites';

// redux-persist guarda cada slice persistido bajo su propia clave ("persist:<key>").
// De la sesión se guarda solo lo necesario para no perderla con un F5: el token y el usuario.
export const authPersistConfig = { key: 'auth', storage, whitelist: ['token', 'user'] };

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  auth: persistReducer(authPersistConfig, authReducer),
});

// Cuando redux-persist recupera la sesión guardada, si el token ya venció se cierra la
// sesión. Así un token viejo no queda en el navegador más tiempo del que sirve.
function createSessionGuard() {
  const listener = createListenerMiddleware();
  listener.startListening({
    predicate: (action) => action.type === REHYDRATE && action.key === authPersistConfig.key,
    effect: (_action, api) => {
      const { token } = api.getState().auth;
      if (token && isTokenExpired(token)) api.dispatch(logout());
    },
  });
  return listener.middleware;
}

// Crea un store nuevo. La app usa uno solo; los tests crean uno por caso para arrancar limpios
// y pueden pasar un estado inicial (por ejemplo, una sesión ya iniciada).
export function makeStore(preloadedState = {}) {
  const saved = readMockState(FAVORITES_KEY, []);
  const store = configureStore({
    reducer: rootReducer,
    // Los favoritos guardados en el navegador sobreviven a una recarga de la página.
    preloadedState: { favorites: { items: Array.isArray(saved) ? saved : [] }, ...preloadedState },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      // Las acciones internas de redux-persist llevan funciones; no son estado de la app.
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).prepend(createSessionGuard()),
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
