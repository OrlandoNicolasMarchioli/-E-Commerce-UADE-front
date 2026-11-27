import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login as loginThunk,
  logout as logoutAction,
  register as registerThunk,
  selectAuthToken,
  selectAuthUser,
  selectIsAuthenticated,
} from '../store/authSlice';

// La sesión vive en Redux (store/authSlice.js) y se persiste con redux-persist.
// El hook mantiene la misma forma que tenía con el contexto, así las páginas no cambian.
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const token = useSelector(selectAuthToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // unwrap() hace que un login fallido tire el error, como antes, para mostrar el mensaje.
  const login = useCallback(
    (email, password) => dispatch(loginThunk({ email, password })).unwrap(),
    [dispatch],
  );
  const register = useCallback((fields) => dispatch(registerThunk(fields)).unwrap(), [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return useMemo(() => ({
    // Con el token vencido no hay usuario, aunque todavía esté en el estado.
    user: isAuthenticated ? user : null,
    token: isAuthenticated ? token : null,
    isAuthenticated,
    isMock: true,
    login,
    register,
    logout,
  }), [user, token, isAuthenticated, login, register, logout]);
}

// Ya no guarda estado: queda para no romper los lugares que todavía lo usan como envoltorio.
export function AuthProvider({ children }) {
  return children;
}
