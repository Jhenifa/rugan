import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrateUser() {
      if (!token) {
        if (active) {
          setUser(null);
          setReady(true);
        }
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (active) {
          setUser(response.data.user);
        }
      } catch {
        localStorage.removeItem("token");
        if (active) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    }

    setReady(false);
    hydrateUser();

    return () => {
      active = false;
    };
  }, [token]);

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const nextToken = response.data.token;

    localStorage.setItem("token", nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    setReady(true);

    return response.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setReady(true);
  }

  async function refreshUser() {
    if (!token) return null;

    const response = await api.get("/auth/me");
    setUser(response.data.user);
    return response.data.user;
  }

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      login,
      logout,
      refreshUser,
      isAuthenticated: Boolean(token && user),
    }),
    [token, user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
