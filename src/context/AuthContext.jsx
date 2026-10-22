import { createContext, useCallback, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../services/authService';
import { readMockState, writeMockState } from '../services/mockStorage';

const AuthContext = createContext(null);
const SESSION_KEY = 'uade_mock_session';

export function AuthProvider({ children }) {
  // Sesión demostrativa: nunca guardar passwords ni inventar un JWT funcional.
  const [user, setUser] = useState(() => readMockState(SESSION_KEY, null));

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const saveUser = useCallback((response) => {
    if (!response?.user?.id) throw new Error('Respuesta simulada de usuario inválida');
    writeMockState(SESSION_KEY, response.user);
    setUser(response.user);
  }, []);

  const login = useCallback(async (email, password) => {
    saveUser(await loginRequest(email, password));
  }, [saveUser]);

  const register = useCallback(async (fields) => {
    saveUser(await registerRequest(fields));
  }, [saveUser]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: Boolean(user), isMock: true, login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth requiere AuthProvider');
  return context;
}