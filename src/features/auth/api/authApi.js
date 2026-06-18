import { parseAuthErrorResponse } from "@/lib/authError";
import { buildApiUrl } from "@/shared/api/apiBase";
import { prepareApiRequestOptions } from "@/shared/api/http";

const AUTH_API_BASE = "/api/v1/auth";

const API_TIMEOUT_MS = 15000;

async function authFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(url, await prepareApiRequestOptions({
      ...options,
      signal: controller.signal,
    }));
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("The server did not respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeToken(rawToken) {
  if (typeof rawToken !== "string") return "";

  const trimmed = rawToken.trim().replace(/^\"|\"$/g, "");
  return trimmed.replace(/^Bearer\s+/i, "").trim();
}

function isLikelyJwt(token) {
  return typeof token === "string" && token.split(".").length >= 3;
}

function getNestedValue(source, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source);
}

function extractAccessToken(data) {
  const candidatePaths = [
    "accessToken",
    "token",
    "jwt",
    "access_token",
    "data.accessToken",
    "data.token",
    "data.jwt",
    "data.access_token",
    "result.accessToken",
    "result.token",
    "result.jwt",
    "user.accessToken",
    "user.token",
    "payload.accessToken",
    "payload.token",
  ];

  const candidates = candidatePaths
    .map((path) => normalizeToken(getNestedValue(data, path)))
    .filter(Boolean);

  const jwtLike = candidates.find(isLikelyJwt);
  return jwtLike || candidates[0] || "";
}

function normalizeAuthResponse(data) {
  const token = extractAccessToken(data);
  const refreshToken =
    getNestedValue(data, "refreshToken") ||
    getNestedValue(data, "data.refreshToken") ||
    getNestedValue(data, "result.refreshToken") ||
    null;
  const user = getNestedValue(data, "user") || getNestedValue(data, "data.user") || null;

  return {
    token,
    accessToken: token,
    refreshToken,
    user,
    payload: data,
  };
}

export async function logoutUser() {
  await authFetch(buildApiUrl(`${AUTH_API_BASE}/logout`), {
    method: "POST",
  });
}

export async function loginUser({ email, password }) {
  const response = await authFetch(buildApiUrl(`${AUTH_API_BASE}/login`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const parsed = await parseAuthErrorResponse(response, "Login failed. Please try again.");
    const error = new Error(parsed.message);
    error.fieldErrors = parsed.fieldErrors;
    throw error;
  }

  const data = await response.json();
  return normalizeAuthResponse(data);
}

export async function registerUser({ fullName, email, password }) {
  const response = await authFetch(buildApiUrl(`${AUTH_API_BASE}/register`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });

  if (!response.ok) {
    const parsed = await parseAuthErrorResponse(response, "Registration failed");
    const error = new Error(parsed.message || "Registration failed");
    error.fieldErrors = parsed.fieldErrors;
    throw error;
  }

  const data = await response.json();
  return normalizeAuthResponse(data);
}

export async function requestPasswordReset({ email }) {
  const response = await authFetch(buildApiUrl(`${AUTH_API_BASE}/forgot-password`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const parsed = await parseAuthErrorResponse(response, "Could not request password reset.");
    const error = new Error(parsed.message || "Could not request password reset.");
    error.fieldErrors = parsed.fieldErrors;
    throw error;
  }

  return response.json();
}

export async function resetPassword({ token, code, newPassword }) {
  const response = await authFetch(buildApiUrl(`${AUTH_API_BASE}/reset-password`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, code, newPassword }),
  });

  if (!response.ok) {
    const parsed = await parseAuthErrorResponse(response, "Could not reset password.");
    const error = new Error(parsed.message || "Could not reset password.");
    error.fieldErrors = parsed.fieldErrors;
    throw error;
  }

  return response.json();
}
