  import { getClientAuthToken, storeAuthSession } from "@/shared/utils/authTokenStorage";
import { buildApiUrl } from "@/shared/api/apiBase";

const CSRF_COOKIE_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";
const TIME_ZONE_HEADER_NAME = "X-Time-Zone";
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const AUTH_REFRESH_ENDPOINT = buildApiUrl("/api/v1/auth/refresh");

let refreshSessionPromise = null;

function sanitizeAuthToken(rawToken) {
  if (typeof rawToken !== "string") return "";

  const trimmed = rawToken.trim().replace(/^\"|\"$/g, "");
  return trimmed.replace(/^Bearer\s+/i, "").trim();
}

export function getAuthHeaders() {
  const token = sanitizeAuthToken(getClientAuthToken());
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function readCookie(name) {
  if (typeof document === "undefined") return "";

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!cookie) return "";

  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return cookie.slice(name.length + 1);
  }
}

function isUnsafeRequest(method = "GET") {
  return UNSAFE_METHODS.has(String(method).toUpperCase());
}

function getClientTimeZone() {
  if (typeof Intl === "undefined") return "";
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
}

export async function ensureCsrfToken() {
  const existingToken = readCookie(CSRF_COOKIE_NAME);
  if (existingToken) return existingToken;

  const response = await fetch(buildApiUrl("/api/v1/auth/csrf"), {
    credentials: "include",
  });
  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data?.message || "Could not prepare security token.");
  }

  return data?.token || readCookie(CSRF_COOKIE_NAME);
}

export async function prepareApiRequestOptions(options = {}) {
  const headers = {
    ...(options.headers || {}),
  };
  const timeZone = getClientTimeZone();

  if (timeZone && !headers[TIME_ZONE_HEADER_NAME]) {
    headers[TIME_ZONE_HEADER_NAME] = timeZone;
  }

  if (isUnsafeRequest(options.method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      headers[CSRF_HEADER_NAME] = csrfToken;
    }
  }

  return {
    credentials: options.credentials ?? "include",
    ...options,
    headers,
  };
}

function isAuthRefreshRequest(url) {
  if (typeof url !== "string") return false;

  return url === AUTH_REFRESH_ENDPOINT || url.endsWith("/api/v1/auth/refresh");
}

async function refreshAuthSession() {
  if (!refreshSessionPromise) {
    refreshSessionPromise = (async () => {
      const response = await fetch(AUTH_REFRESH_ENDPOINT, await prepareApiRequestOptions({ method: "POST" }));
      const data = await parseJsonSafely(response);

      if (!response.ok) {
        const error = new Error(data?.message || "Could not refresh session.");
        error.status = response.status;
        error.data = data;
        throw error;
      }

      if (data?.user) {
        storeAuthSession({ user: data.user });
      }

      return data;
    })().finally(() => {
      refreshSessionPromise = null;
    });
  }

  return refreshSessionPromise;
}

export async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    try {
      const text = await response.text();
      return text ? { message: text } : null;
    } catch {
      return null;
    }
  }
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, await prepareApiRequestOptions(options));
  const data = await parseJsonSafely(response);

  if (response.status === 401 && !options.skipAuthRefresh && !isAuthRefreshRequest(url)) {
    try {
      await refreshAuthSession();
      return fetchJson(url, {
        ...options,
        skipAuthRefresh: true,
      });
    } catch {
      // Keep the original endpoint's auth error so feature-level messages stay accurate.
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}.`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function fetchAuthenticatedJson(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  return fetchJson(url, {
    ...options,
    headers,
  });
}
