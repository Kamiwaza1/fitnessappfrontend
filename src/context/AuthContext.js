"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  clearStoredAuthToken,
  decodeJwtPayload,
  getTokenExpiryMs,
  isTokenExpired,
  readStoredAuthUser,
  readStoredAuthToken,
  storeAuthSession,
} from "@/shared/utils/authTokenStorage";

const AuthContext = createContext();

function getUserFromToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return { username: "User", fullName: null };

  return {
    username: payload.email || payload.username || payload.sub || "User",
    fullName: payload.fullName || payload.name || null,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredAuthToken());
  const [user, setUser] = useState(() => {
    const initialToken = readStoredAuthToken();
    if (!initialToken || isTokenExpired(initialToken)) return null;
    return readStoredAuthUser() || getUserFromToken(initialToken);
  });

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredAuthToken();
  }, []);

  const login = useCallback(
    (authOrUsername, maybeToken) => {
      const authPayload =
        authOrUsername && typeof authOrUsername === "object" && !Array.isArray(authOrUsername)
          ? authOrUsername
          : null;
      const authUser = authPayload?.user || authPayload;
      const username =
        typeof authOrUsername === "string"
          ? authOrUsername
          : authUser?.email || authUser?.username || authUser?.fullName;
      const nextToken = authPayload
        ? maybeToken || authPayload.accessToken || authPayload.token || authUser?.accessToken || authUser?.token || null
        : maybeToken || null;
      const nextRefreshToken = authPayload?.refreshToken || null;

      if (nextToken) {
        if (isTokenExpired(nextToken)) {
          logout();
          return;
        }

        const parsedUser = getUserFromToken(nextToken);
        const normalizedUser = {
          ...authUser,
          username: username || parsedUser.username,
          fullName: authUser?.fullName || parsedUser.fullName || null,
        };
        storeAuthSession({
          accessToken: nextToken,
          refreshToken: nextRefreshToken,
          user: normalizedUser,
        });
        setToken(nextToken);
        setUser(normalizedUser);
        return;
      }

      setUser({
        username: username || "User",
        fullName: authUser?.fullName || null,
      });
    },
    [logout]
  );

  useEffect(() => {
    if (!token || typeof window === "undefined") return undefined;

    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) return undefined;

    const msUntilExpiry = expiryMs - Date.now();
    const timeoutId = window.setTimeout(() => {
      logout();
      window.location.assign("/");
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
