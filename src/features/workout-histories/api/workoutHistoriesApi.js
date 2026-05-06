import { fetchAuthenticatedJson } from "@/shared/api/http";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const WORKOUT_HISTORIES_API_ENDPOINT =
  process.env.NEXT_PUBLIC_WORKOUT_HISTORIES_API_ENDPOINT ?? `${API_BASE}/api/v1/workout-history`;

function getAuthorizationErrorMessage(error, fallbackMessage) {
  if (error?.status === 401 || error?.status === 403) {
    return error?.data?.message || "Not authorized. Please log out and log in again.";
  }

  return error?.data?.message || error?.message || fallbackMessage;
}

function extractWorkoutHistoryCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.workoutHistories)) return payload.workoutHistories;
  if (Array.isArray(payload?.histories)) return payload.histories;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function normalizeWorkoutHistory(item, index = 0) {
  const performedAt =
    item?.workoutDate || item?.performedAt || item?.completedAt || item?.date || item?.createdAt || "";

  return {
    id: String(item?.workoutId || item?.historyId || item?.id || item?._id || index),
    title: item?.workoutName || item?.title || item?.name || "Workout Session",
    date: String(performedAt),
    durationMinutes: Number.isFinite(Number(item?.durationMinutes))
      ? Number(item?.durationMinutes)
      : null,
    sets: Number.isFinite(Number(item?.sets)) ? Number(item?.sets) : null,
    reps: Number.isFinite(Number(item?.reps)) ? Number(item?.reps) : null,
    weightKg: Number.isFinite(Number(item?.weightKg)) ? Number(item?.weightKg) : null,
    category: item?.category || "GENERAL",
    status: "Completed",
    notes: item?.notes || "",
    description: item?.description || "",
    createdAt: item?.createdAt || "",
    updatedAt: item?.updatedAt || "",
  };
}

export async function fetchWorkoutHistories() {
  try {
    const payload = await fetchAuthenticatedJson(WORKOUT_HISTORIES_API_ENDPOINT, {
      method: "GET",
    });

    return extractWorkoutHistoryCollection(payload).map((item, index) => normalizeWorkoutHistory(item, index));
  } catch (error) {
    throw new Error(getAuthorizationErrorMessage(error, "Failed to load workout histories."));
  }
}
