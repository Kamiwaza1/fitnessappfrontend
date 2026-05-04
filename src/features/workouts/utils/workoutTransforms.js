export function normalizeWorkout(workout, index = 0) {
  const exercises = Array.isArray(workout?.exercises)
    ? workout.exercises.map((exercise, exerciseIndex) => {
        if (typeof exercise === "string") {
          return {
            id: `${exercise}-${exerciseIndex}`,
            name: exercise,
            focus: "",
            equipment: "",
          };
        }

        return {
          id: exercise?.id || exercise?._id || `${exercise?.name || "exercise"}-${exerciseIndex}`,
          name: exercise?.name || `Exercise ${exerciseIndex + 1}`,
          focus: exercise?.focus || "",
          equipment: exercise?.equipment || "",
        };
      })
    : [];

  return {
    id: String(workout?.id || workout?._id || index),
    title: workout?.title || workout?.name || workout?.workoutTitle || "Untitled Workout",
    name: workout?.name || workout?.title || workout?.workoutTitle || "Workout",
    goal: workout?.goal || workout?.primaryGoal || "",
    date: workout?.date || workout?.scheduledDate || workout?.workoutDate || "",
    workoutDate: String(workout?.workoutDate || workout?.scheduledDate || workout?.date || "").slice(0, 10),
    duration: String(workout?.duration || workout?.durationMinutes || 60),
    durationMinutes: Number.isFinite(Number(workout?.durationMinutes || workout?.duration))
      ? Number(workout?.durationMinutes || workout?.duration)
      : null,
    notes: workout?.notes || workout?.description || "",
    exercises,
    status: workout?.status || "Scheduled",
  };
}

export function extractWorkoutCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.workouts)) return payload.workouts;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}
