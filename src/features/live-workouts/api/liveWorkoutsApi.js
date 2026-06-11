import { buildApiUrl } from "@/shared/api/apiBase";
import { fetchAuthenticatedJson } from "@/shared/api/http";

const LIVE_WORKOUTS_API_ENDPOINT = buildApiUrl("/api/v1/live-workouts");

function normalizeLiveWorkoutRoom(payload = {}) {
  const room = payload?.room || payload?.data || payload?.liveWorkoutRoom || payload;
  const roomCode = room?.roomCode || room?.code || room?.id || "";

  return {
    ...room,
    roomCode: String(roomCode).toUpperCase(),
  };
}

export async function createLiveWorkoutRoom(workoutId) {
  const payload = await fetchAuthenticatedJson(LIVE_WORKOUTS_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ workoutId }),
  });

  return normalizeLiveWorkoutRoom(payload);
}

export async function fetchLiveWorkoutRoom(roomCode) {
  const payload = await fetchAuthenticatedJson(`${LIVE_WORKOUTS_API_ENDPOINT}/${encodeURIComponent(roomCode)}`, {
    method: "GET",
  });

  return normalizeLiveWorkoutRoom(payload);
}

export async function fetchLiveWorkoutRoomDetails(roomCode) {
  const payload = await fetchAuthenticatedJson(
    `${LIVE_WORKOUTS_API_ENDPOINT}/${encodeURIComponent(roomCode)}/details`,
    {
      method: "GET",
    }
  );

  return {
    room: normalizeLiveWorkoutRoom(payload?.room),
    messages: Array.isArray(payload?.messages) ? payload.messages : [],
  };
}

export async function fetchLiveWorkoutMessages(roomCode) {
  const payload = await fetchAuthenticatedJson(
    `${LIVE_WORKOUTS_API_ENDPOINT}/${encodeURIComponent(roomCode)}/messages`,
    {
      method: "GET",
    }
  );

  return Array.isArray(payload) ? payload : [];
}

export async function closeLiveWorkoutRoom(roomCode) {
  return fetchAuthenticatedJson(`${LIVE_WORKOUTS_API_ENDPOINT}/${encodeURIComponent(roomCode)}`, {
    method: "DELETE",
  });
}
