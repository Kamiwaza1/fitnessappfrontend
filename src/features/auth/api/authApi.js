import { parseAuthErrorResponse } from "@/lib/authError";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const AUTH_API_BASE = "/api/v1/auth";

function normalizeAuthResponse(data) {
  const token = data?.accessToken || data?.token || data?.jwt;
  const refreshToken = data?.refreshToken || null;
  const user = data?.user || null;

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
