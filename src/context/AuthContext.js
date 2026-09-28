import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { getToken, setToken, clearToken, onUnauthorized } from '../services/api';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadSession = useCallback(async () => {
    if (!getToken()) {
      setInitializing(false);
      return;
    }
    try {
      const res = await authService.me();
      setUser(res.data);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => onUnauthorized(() => setUser(null)), []);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const res = await authService.login(email, password);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authService.me();
    setUser(res.data);
    return res.data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      authError,
      isAuthenticated: Boolean(user),
      isSuperAdmin: user?.role === ROLES.SUPER_ADMIN,
      isBusinessAdmin: user?.role === ROLES.BUSINESS_ADMIN,
      login,
      logout,
      refreshUser,
    }),
    [user, initializing, authError, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
