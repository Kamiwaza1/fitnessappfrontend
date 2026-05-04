import { parseAuthErrorResponse } from "@/lib/authError";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const USER_API_BASE = "/api/v1/user/me";

export async function updateCurrentUser(password, newPassword) {
    const response = await fetch( `${API_BASE}${USER_API_BASE}/update-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, newPassword }),
    });
    if (!response.ok) {
        const error = await parseAuthErrorResponse(response);
        throw new Error(error);
    }
    return response.json();
  }