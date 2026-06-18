"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  AUTH_SESSION_EVENT,
  COOKIE_AUTH_SESSION,
  clearStoredAuthToken,
  decodeJwtPayload,
  readStoredAuthUserJson,
  storeAuthSession,
} from "@/shared/utils/authTokenStorage";
import { logoutUser } from "@/features/auth/api/authApi";

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

function getAuthSessionSnapshot() {
  return readStoredAuthUserJson() ? COOKIE_AUTH_SESSION : null;
}

function getAuthUserSnapshot() {
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
  const token = useSyncExternalStore(subscribeToAuthSession, getAuthSessionSnapshot, () => null);
  const userJson = useSyncExternalStore(subscribeToAuthSession, getAuthUserSnapshot, () => "");
  const user = useMemo(() => parseAuthUser(userJson, token), [userJson, token]);

  const logout = useCallback(() => {
    logoutUser().catch(() => {});
    clearStoredAuthToken();
  }, []);

  const login = useCallback(
    (authOrUsername, maybeToken) => {
      const authPayload =
        authOrUsername && typeof authOrUsername === "object" && !Array.isArray(authOrUsername)
          ? authOrUsername
          : null;
      const authUser = authPayload?.user || null;
      const username =
        typeof authOrUsername === "string"
          ? authOrUsername
          : authUser?.email || authUser?.username || authUser?.fullName;
      const nextToken = authPayload
        ? maybeToken || authPayload.accessToken || authPayload.token || authUser?.accessToken || authUser?.token || null
        : maybeToken || null;
      const parsedUser = nextToken ? getUserFromToken(nextToken) : null;

      storeAuthSession({
        user: {
          ...authUser,
          username: username || "User",
          fullName: authUser?.fullName || parsedUser?.fullName || null,
        },
      });
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
