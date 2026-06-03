export function normalizeWorkout(workout, index = 0) {
  const exercises = Array.isArray(workout?.exercises)
    ? workout.exercises.map((exercise, exerciseIndex) => {
        const reps = Number(exercise?.reps);
        const weightKg = Number(exercise?.weightKg);
        return {
          id: exercise?.id || exercise?._id || `${exercise?.name || "exercise"}-${exerciseIndex}`,
          name: exercise?.name || `Exercise ${exerciseIndex + 1}`,
          muscleType: exercise?.muscleType || "FULL_BODY",
          sets: Number.isFinite(Number(exercise?.sets)) ? Number(exercise?.sets) : null,
          reps: Number.isFinite(reps) && reps > 1 ? reps : null,
          weightKg: Number.isFinite(weightKg) && weightKg > 0 ? weightKg : null,
          notes: exercise?.notes || "",
        };
      })
    : [];

  return {
    id: String(workout?.workoutId || workout?.id || workout?._id || index),
    title: workout?.workoutName || workout?.title || workout?.name || workout?.workoutTitle || "Untitled Workout",
    name: workout?.workoutName || workout?.name || workout?.title || workout?.workoutTitle || "Workout",
    goal: workout?.description || workout?.goal || workout?.primaryGoal || "",
    date: workout?.date || workout?.scheduledDate || workout?.workoutDate || "",
    workoutDate: String(workout?.workoutDate || workout?.scheduledDate || workout?.date || "").slice(0, 10),
    duration: String(workout?.duration || workout?.durationMinutes || 60),
    durationMinutes: Number.isFinite(Number(workout?.durationMinutes || workout?.duration))
      ? Number(workout?.durationMinutes || workout?.duration)
      : null,
    sets: Number.isFinite(Number(workout?.sets)) ? Number(workout?.sets) : null,
    reps: Number.isFinite(Number(workout?.reps)) ? Number(workout?.reps) : null,
    weightKg: Number.isFinite(Number(workout?.weightKg)) ? Number(workout?.weightKg) : null,
    notes: workout?.notes || "",
    description: workout?.description || "",
    category: workout?.category || "GENERAL",
    muscleType: workout?.muscleType || "FULL_BODY",
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
