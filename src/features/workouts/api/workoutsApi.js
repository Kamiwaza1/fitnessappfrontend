import { fetchAuthenticatedJson } from "@/shared/api/http";
import { extractWorkoutCollection, normalizeWorkout } from "@/features/workouts/utils/workoutTransforms";
import { buildApiUrl } from "@/shared/api/apiBase";

const WORKOUTS_API_ENDPOINT = buildApiUrl("/api/v1/workouts");

function getAuthorizationErrorMessage(error, fallbackMessage) {
  if (error?.status === 401 || error?.status === 403) {
    return error?.data?.message || "Not authorized. Please log out and log in again.";
  }

  return error?.data?.message || error?.message || fallbackMessage;
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
  const trimmedTitle = formState.title.trim();
  const trimmedDescription = formState.description.trim();
  const exercises = (formState.exercises || []).map((exercise) => ({
    name: exercise.name.trim(),
    muscleType: exercise.muscleType,
    sets: Number(exercise.sets),
    reps: 1,
    weightKg: 0,
    notes: "",
  }));
  const primaryMuscleType = exercises[0]?.muscleType || "FULL_BODY";

  const payload = {
    workoutName: trimmedTitle,
    workoutDate: formState.date,
    durationMinutes: 1,
    sets: exercises.reduce((sum, exercise) => sum + exercise.sets, 0),
    reps: exercises.reduce((sum, exercise) => sum + exercise.reps, 0),
    weightKg: exercises.reduce((max, exercise) => Math.max(max, exercise.weightKg), 0),
    notes: "",
    description: trimmedDescription,
    category: formState.category,
    muscleType: primaryMuscleType,
    exercises,
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

export async function updateWorkout({ workoutId, formState }) {
  const trimmedTitle = formState.title.trim();
  const trimmedDescription = formState.description.trim();
  const exercises = (formState.exercises || []).map((exercise) => ({
    name: exercise.name.trim(),
    muscleType: exercise.muscleType,
    sets: Number(exercise.sets),
    reps: 1,
    weightKg: 0,
    notes: "",
  }));
  const primaryMuscleType = exercises[0]?.muscleType || "FULL_BODY";

  const payload = {
    workoutName: trimmedTitle,
    workoutDate: formState.date,
    durationMinutes: 1,
    sets: exercises.reduce((sum, exercise) => sum + exercise.sets, 0),
    reps: exercises.reduce((sum, exercise) => sum + exercise.reps, 0),
    weightKg: exercises.reduce((max, exercise) => Math.max(max, exercise.weightKg), 0),
    notes: "",
    description: trimmedDescription,
    category: formState.category,
    muscleType: primaryMuscleType,
    exercises,
  };

  try {
    const data = await fetchAuthenticatedJson(`${WORKOUTS_API_ENDPOINT}/${workoutId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const updatedWorkout = data?.workout || data?.data || data;
    return normalizeWorkout(updatedWorkout);
  } catch (error) {
    if (error?.data?.message) {
      throw new Error(error.data.message);
    }

    throw new Error(error?.message || "Could not update workout.");
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

export async function saveWorkoutSession(payload) {
  try {
    return await fetchAuthenticatedJson(buildApiUrl("/api/v1/workout-history"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(getAuthorizationErrorMessage(error, "Could not save workout session."));
  }
}
