import { fetchAuthenticatedJson } from "@/shared/api/http";
import { extractWorkoutCollection, normalizeWorkout } from "@/features/workouts/utils/workoutTransforms";

const WORKOUTS_API_ENDPOINT = "/api/v1/workouts";

function getAuthorizationErrorMessage(error, fallbackMessage) {
  if (error?.status === 401 || error?.status === 403) {
    return "Not authorized. Please log out and log in again.";
  }

  return error?.message || fallbackMessage;
}

export async function fetchWorkouts() {
  try {
    const payload = await fetchAuthenticatedJson(WORKOUTS_API_ENDPOINT, {
      method: "GET",
    });

    return extractWorkoutCollection(payload).map((workout, index) => normalizeWorkout(workout, index));
  } catch (error) {
    throw new Error(getAuthorizationErrorMessage(error, "Failed to load workouts."));
  }
}

export async function createWorkout({ formState }) {
  const payload = {
    name: formState.title.trim(),
    workoutDate: formState.date,
    durationMinutes: Number(formState.duration),
    notes: formState.notes.trim(),
  };

  try {
    const data = await fetchAuthenticatedJson(WORKOUTS_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const createdWorkout = data?.workout || data?.data || data;
    return normalizeWorkout(createdWorkout);
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      throw new Error("Not authorized. Please log out and log in again.");
    }

    if (error?.data?.message) {
      throw new Error(error.data.message);
    }

    throw new Error(error?.message || "Could not save workout.");
  }
}

export async function deleteWorkout(workoutId) {
  try {
    await fetchAuthenticatedJson(`${WORKOUTS_API_ENDPOINT}/${workoutId}`, {
      method: "DELETE",
    });
  } catch {
    throw new Error("Could not delete workout. Please try again.");
  }
}
