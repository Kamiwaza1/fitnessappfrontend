"use client";
<<<<<<< Updated upstream
import React, { createContext, useContext, useState } from 'react';
=======
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  clearStoredAuthToken,
  decodeJwtPayload,
  getTokenExpiryMs,
  isTokenExpired,
  readStoredAuthToken,
  storeAuthToken,
} from "@/lib/authToken";
>>>>>>> Stashed changes

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

<<<<<<< Updated upstream
  const login = (username) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };
=======
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredAuthToken();
  }, []);

  const login = (authOrUsername, maybeToken) => {
    const authUser =
      authOrUsername && typeof authOrUsername === "object" && !Array.isArray(authOrUsername)
        ? authOrUsername
        : null;
    const username = typeof authOrUsername === "string" ? authOrUsername : authUser?.email || authUser?.username;
    const newToken = authUser ? maybeToken || authUser.accessToken || authUser.token : maybeToken;

    if (newToken) {
      if (isTokenExpired(newToken)) {
        clearStoredAuthToken();
        setUser(null);
        setToken(null);
        return;
      }
      const parsedUser = getUserFromToken(newToken);
      storeAuthToken(newToken);
      setToken(newToken);
      setUser({
        username: username || parsedUser.username,
        fullName: authUser?.fullName || parsedUser.fullName || null,
      });
      return;
    }

    setUser({ username: username || "User", fullName: null });
  };

  useEffect(() => {
    if (!token || typeof window === 'undefined') return;
    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) return;

    const msUntilExpiry = expiryMs - Date.now();
    const timeoutId = window.setTimeout(() => {
      logout();
      window.location.assign('/');
    }, Math.max(msUntilExpiry, 0));

    return () => window.clearTimeout(timeoutId);
  }, [token, logout]);
>>>>>>> Stashed changes

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
