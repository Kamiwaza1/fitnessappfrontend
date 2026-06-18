const ACCESS_TOKEN_KEYS = ["accessToken", "authToken", "token"];
const REFRESH_TOKEN_KEYS = ["refreshToken"];
const AUTH_USER_KEYS = ["user"];
const AUTH_COOKIE_NAMES = ["authToken", "token", "jwt", "accessToken"];
export const AUTH_SESSION_EVENT = "fitness:auth-session-updated";
export const COOKIE_AUTH_SESSION = "cookie-session";

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function decodeJwtPayload(token) {
  if (typeof token !== "string" || !token.trim()) return null;

  const normalizedToken = safeDecodeURIComponent(token.trim());
  const tokenParts = normalizedToken.split(".");
  if (tokenParts.length < 2) return null;

  try {
    const base64Payload = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, "=");

    let payloadJson = "";
    if (typeof atob === "function") {
      payloadJson = atob(paddedPayload);
    } else if (typeof Buffer !== "undefined") {
      payloadJson = Buffer.from(paddedPayload, "base64").toString("utf8");
    } else {
      return null;
    }

    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp * 1000;
}

export function isTokenExpired(token, nowMs = Date.now()) {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return false;
  return nowMs >= expiryMs;
}

export function readStoredAuthToken() {
  if (typeof window === "undefined") return null;

  for (const key of ACCESS_TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return null;
}

export function readStoredRefreshToken() {
  if (typeof window === "undefined") return null;

  for (const key of REFRESH_TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return null;
}

export function readStoredAuthUser() {
  if (typeof window === "undefined") return null;

  for (const key of AUTH_USER_KEYS) {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) continue;
    try {
      return JSON.parse(rawValue);
    } catch {
      return null;
    }
  }

  return null;
}

export function readStoredAuthUserJson() {
  if (typeof window === "undefined") return "";

  for (const key of AUTH_USER_KEYS) {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue) return rawValue;
  }

  return "";
}

export function readAuthTokenFromCookies(cookieSource) {
  const cookieString =
    typeof cookieSource === "string"
      ? cookieSource
      : typeof document !== "undefined"
        ? document.cookie
        : "";

  if (!cookieString) return "";

  const tokenCookie = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => AUTH_COOKIE_NAMES.some((name) => part.startsWith(`${name}=`)));

  if (!tokenCookie) return "";

  const [, value = ""] = tokenCookie.split("=");
  return safeDecodeURIComponent(value);
}

export function getClientAuthToken() {
  return readStoredAuthToken() || readAuthTokenFromCookies();
}

export function storeAuthToken() {
  clearReadableAuthTokens();
}

export function storeAuthSession({ user }) {
  if (typeof window === "undefined") return;
  clearReadableAuthTokens();
  if (user) {
    for (const key of AUTH_USER_KEYS) {
      window.localStorage.setItem(key, JSON.stringify(user));
    }
  }
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT));
}

export function clearStoredAuthToken() {
  if (typeof window === "undefined") return;

  clearReadableAuthTokens();
  for (const key of AUTH_USER_KEYS) {
    window.localStorage.removeItem(key);
  }

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT));
}

function clearReadableAuthTokens() {
  if (typeof window === "undefined") return;

  for (const key of ACCESS_TOKEN_KEYS) {
    window.localStorage.removeItem(key);
  }
  for (const key of REFRESH_TOKEN_KEYS) {
    window.localStorage.removeItem(key);
  }

  document.cookie = "authToken=;path=/;max-age=0";
  document.cookie = "token=;path=/;max-age=0";
  document.cookie = "jwt=;path=/;max-age=0";
  document.cookie = "accessToken=;path=/;max-age=0";
}
