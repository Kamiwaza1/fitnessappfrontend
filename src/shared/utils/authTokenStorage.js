const AUTH_TOKEN_KEYS = ["authToken", "token"];
const AUTH_COOKIE_NAMES = ["authToken", "token", "jwt", "accessToken"];

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

  for (const key of AUTH_TOKEN_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value) return value;
  }

  return null;
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

export function storeAuthToken(token) {
  if (!token || typeof window === "undefined") return;

  for (const key of AUTH_TOKEN_KEYS) {
    window.localStorage.setItem(key, token);
  }

  const cookieParts = ["path=/", "SameSite=Strict"];
  if (window.location.protocol === "https:") {
    cookieParts.push("Secure");
  }

  const expiryMs = getTokenExpiryMs(token);
  if (expiryMs) {
    const maxAge = Math.max(0, Math.floor((expiryMs - Date.now()) / 1000));
    cookieParts.push(`Max-Age=${maxAge}`);
  }

  document.cookie = `authToken=${encodeURIComponent(token)};${cookieParts.join(";")}`;
}

export function clearStoredAuthToken() {
  if (typeof window === "undefined") return;

  for (const key of AUTH_TOKEN_KEYS) {
    window.localStorage.removeItem(key);
  }

  document.cookie = "authToken=;path=/;max-age=0";
  document.cookie = "token=;path=/;max-age=0";
  document.cookie = "jwt=;path=/;max-age=0";
}
