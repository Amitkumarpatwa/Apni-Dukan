import { createContext, useEffect, useMemo, useState } from "react";
import { setAuthToken } from "../api/http";

const AuthContext = createContext(null);
const STORAGE_KEY = "apnidukan_admin_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY) || "");

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem(STORAGE_KEY, jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken("");
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export { AuthContext };
