import { buildApiUrl } from "@/shared/api/apiBase";
import { fetchAuthenticatedJson, getAuthHeaders } from "@/shared/api/http";

const LIVE_WORKOUTS_API_ENDPOINT = buildApiUrl("/api/v1/live-workouts");

export async function createLiveWorkoutRoom(workoutId) {
  return fetchAuthenticatedJson(LIVE_WORKOUTS_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ workoutId }),
  });
}

export async function fetchLiveWorkoutRoom(roomCode) {
  return fetchAuthenticatedJson(`${LIVE_WORKOUTS_API_ENDPOINT}/${encodeURIComponent(roomCode)}`, {
    method: "GET",
  });
}

export async function closeLiveWorkoutRoom(roomCode) {
  return fetchAuthenticatedJson(`${LIVE_WORKOUTS_API_ENDPOINT}/${encodeURIComponent(roomCode)}`, {
    method: "DELETE",
  });
}

export function getLiveWorkoutAuthHeader() {
  return getAuthHeaders().Authorization || "";
}
