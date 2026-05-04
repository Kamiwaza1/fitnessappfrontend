import { getClientAuthToken } from "@/shared/utils/authTokenStorage";

export function getAuthHeaders() {
  const token = getClientAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
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

  return fetchJson(url, {
    credentials: "include",
    ...options,
    headers,
  });
}
