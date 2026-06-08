import { fetchAuthenticatedJson } from "@/shared/api/http";
import { buildApiUrl } from "@/shared/api/apiBase";

const USER_API_ENDPOINT = buildApiUrl("/api/v1/users/me");

export async function fetchCurrentUser() {
  try {
    return await fetchAuthenticatedJson(USER_API_ENDPOINT, {
      method: "GET",
    });
  } catch (error) {
    throw new Error(error?.data?.message || error?.message || "Could not load current user.");
  }
}

export async function updateCurrentUser({ fullName, email, password, dailyCalorieTarget }) {
  const payload = {};
  if (typeof fullName === "string" && fullName.trim()) payload.fullName = fullName.trim();
  if (typeof email === "string" && email.trim()) payload.email = email.trim();
  if (typeof password === "string" && password.trim()) payload.password = password;
  if (dailyCalorieTarget !== undefined) payload.dailyCalorieTarget = dailyCalorieTarget;

  try {
    return await fetchAuthenticatedJson(USER_API_ENDPOINT, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(error?.data?.message || error?.message || "Could not update user.");
  }
}
