import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken } from "../api/client";

const AuthContext = createContext(null);
const TOKEN_KEY = "traveloop_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (newToken, profile) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(profile || null);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthStore = () => useContext(AuthContext);
