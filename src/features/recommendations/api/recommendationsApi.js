import { fetchAuthenticatedJson } from "@/shared/api/http";
import { buildApiUrl } from "@/shared/api/apiBase";
import { normalizeWorkout } from "@/features/workouts/utils/workoutTransforms";

const RECOMMENDATIONS_API_ENDPOINT = buildApiUrl("/api/v1/recommendations");

function normalizeRecommendation(item, index = 0) {
  return {
    workoutId: String(item?.workoutId || item?.id || index),
    workoutName: item?.workoutName || item?.name || item?.title || "Recommended Workout",
    score: Number.isFinite(Number(item?.score)) ? Number(item.score) : 0,
    reason: item?.reason || "Recommended for your current training profile.",
  };
}

function extractRecommendationCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.recommendations)) return payload.recommendations;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function getRecommendationErrorMessage(error, fallbackMessage) {
  if (error?.status === 401 || error?.status === 403) {
    return error?.data?.message || "Not authorized. Please log out and log in again.";
  }

  return error?.data?.message || error?.message || fallbackMessage;
}

export async function fetchRecommendations() {
  try {
    const payload = await fetchAuthenticatedJson(RECOMMENDATIONS_API_ENDPOINT, {
      method: "GET",
    });
    return extractRecommendationCollection(payload).map((item, index) => normalizeRecommendation(item, index));
  } catch (error) {
    throw new Error(getRecommendationErrorMessage(error, "Could not load recommendations."));
  }
}

export async function ignoreRecommendation(workoutId) {
  try {
    await fetchAuthenticatedJson(`${RECOMMENDATIONS_API_ENDPOINT}/${workoutId}/ignore`, {
      method: "POST",
    });
  } catch (error) {
    throw new Error(getRecommendationErrorMessage(error, "Could not ignore recommendation."));
  }
}

export async function startRecommendedWorkout(workoutId) {
  try {
    const payload = await fetchAuthenticatedJson(`${RECOMMENDATIONS_API_ENDPOINT}/${workoutId}/start`, {
      method: "POST",
    });
    return normalizeWorkout(payload?.workout || payload?.data || payload);
  } catch (error) {
    throw new Error(getRecommendationErrorMessage(error, "Could not start recommendation."));
  }
}
