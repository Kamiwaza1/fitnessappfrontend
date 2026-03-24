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
  return { username: payload?.sub || payload?.email || payload?.username || 'User' };
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
      setToken(newToken);
      setUser({ username: username || getUserFromToken(newToken).username });
      return;
    }

    setUser({ username: username || 'User' });
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
