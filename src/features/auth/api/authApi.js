import { parseAuthErrorResponse } from "@/lib/authError";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const AUTH_API_BASE = "/api/v1/auth";

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

  if (!token) {
    throw new Error("Authentication succeeded but token is missing.");
  }

  return {
    token,
    accessToken: token,
    refreshToken,
    user,
    payload: data,
  };
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE}${AUTH_API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
  const response = await fetch(`${API_BASE}${AUTH_API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
