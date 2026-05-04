export function validateWorkoutForm(formState) {
  if (!formState.title.trim()) {
    return "Workout title is required.";
  }

  if (!formState.date) {
    return "Workout date is required.";
  }

  if (!Number(formState.duration) || Number(formState.duration) < 1) {
    return "Duration must be at least 1 minute.";
  }

  return "";
}
