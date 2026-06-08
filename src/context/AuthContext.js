"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  AUTH_SESSION_EVENT,
  clearStoredAuthToken,
  decodeJwtPayload,
  getTokenExpiryMs,
  isTokenExpired,
  readStoredAuthUserJson,
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

function subscribeToAuthSession(callback) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(AUTH_SESSION_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthTokenSnapshot() {
  const token = readStoredAuthToken();
  return token && !isTokenExpired(token) ? token : null;
}

function getAuthUserSnapshot() {
  const token = getAuthTokenSnapshot();
  if (!token) return "";
  return readStoredAuthUserJson();
}

function parseAuthUser(userJson, token) {
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return token ? getUserFromToken(token) : null;
    }
  }

  return token ? getUserFromToken(token) : null;
}

export function AuthProvider({ children }) {
  const token = useSyncExternalStore(subscribeToAuthSession, getAuthTokenSnapshot, () => null);
  const userJson = useSyncExternalStore(subscribeToAuthSession, getAuthUserSnapshot, () => "");
  const user = useMemo(() => parseAuthUser(userJson, token), [userJson, token]);

  const logout = useCallback(() => {
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
        return;
      }

      storeAuthSession({
        user: {
          username: username || "User",
          fullName: authUser?.fullName || null,
        },
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
