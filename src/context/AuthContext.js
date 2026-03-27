"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  clearStoredAuthToken,
  decodeJwtPayload,
  getTokenExpiryMs,
  isTokenExpired,
  readStoredAuthToken,
} from '@/lib/authToken';

const AuthContext = createContext();

function getUserFromToken(token) {
  const payload = decodeJwtPayload(token);
  const fullName =
    payload?.fullName ||
    payload?.name ||
    payload?.full_name ||
    [payload?.given_name, payload?.family_name].filter(Boolean).join(" ").trim() ||
    null;

  return {
    username: payload?.sub || payload?.email || payload?.username || "User",
    fullName,
  };
}

function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const stored = readStoredAuthToken();
  if (!stored) {
    return { user: null, token: null };
  }

  if (isTokenExpired(stored)) {
    clearStoredAuthToken();
    return { user: null, token: null };
  }

  return { user: getUserFromToken(stored), token: stored };
}

export function AuthProvider({ children }) {
  const initialAuthState = getInitialAuthState();
  const [user, setUser] = useState(initialAuthState.user);
  const [token, setToken] = useState(initialAuthState.token);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredAuthToken();
  }, []);

  const login = (username, newToken) => {
    if (newToken) {
      if (isTokenExpired(newToken)) {
        clearStoredAuthToken();
        setUser(null);
        setToken(null);
        return;
      }
      const parsedUser = getUserFromToken(newToken);
      setToken(newToken);
      setUser({
        username: username || parsedUser.username,
        fullName: parsedUser.fullName || null,
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
      window.location.assign('/login');
    }, Math.max(msUntilExpiry, 0));

    return () => window.clearTimeout(timeoutId);
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
