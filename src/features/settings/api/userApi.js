import { parseAuthErrorResponse } from "@/lib/authError";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const USER_API_BASE = "/api/v1/users/me";

export async function fetchCurrentUser() {
  const response = await fetch(`${API_BASE}${USER_API_BASE}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const parsed = await parseAuthErrorResponse(response, "Could not load current user.");
    throw new Error(parsed.message || "Could not load current user.");
  }

  return response.json();
}

export async function updateCurrentUser({ fullName, email, password }) {
  const payload = {};
  if (typeof fullName === "string" && fullName.trim()) payload.fullName = fullName.trim();
  if (typeof email === "string" && email.trim()) payload.email = email.trim();
  if (typeof password === "string" && password.trim()) payload.password = password;

  const response = await fetch(`${API_BASE}${USER_API_BASE}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const parsed = await parseAuthErrorResponse(response, "Could not update user.");
    throw new Error(parsed.message || "Could not update user.");
  }

  return response.json();
}
