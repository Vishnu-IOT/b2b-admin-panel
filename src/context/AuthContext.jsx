import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);
const TOKEN_KEY = "vartha_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setError(null);
    const { user: u, token } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    setError(null);
    const { user: u, token } = await authApi.register({ name, email, password });
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, setError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
