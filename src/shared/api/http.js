import { getClientAuthToken } from "@/shared/utils/authTokenStorage";

function sanitizeAuthToken(rawToken) {
  if (typeof rawToken !== "string") return "";

  const trimmed = rawToken.trim().replace(/^\"|\"$/g, "");
  return trimmed.replace(/^Bearer\s+/i, "").trim();
}

export function getAuthHeaders() {
  const token = sanitizeAuthToken(getClientAuthToken());
  return token ? { Authorization: `Bearer ${token}` } : {};
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
  const response = await fetch(url, options);
  const data = await parseJsonSafely(response);

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

  const nextCredentials = options.credentials ?? "omit";

  return fetchJson(url, {
    credentials: nextCredentials,
    ...options,
    headers,
  });
}
