export function validateWorkoutForm(formState) {
  const title = formState.title.trim();
  if (!title) {
    return "Workout name is required.";
  }

  if (title.length < 3) {
    return "Name must be at least 3 characters";
  }

  if (title.length > 255) {
    return "Name cannot be longer than 255 characters";
  }

  if (!formState.date) {
    return "Workout date is required.";
  }

  const selectedDate = new Date(`${formState.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (selectedDate < today) {
    return "Workout date cannot be in the past";
  }

  if (selectedDate > maxDate) {
    return "Workout date cannot be more than one year ahead";
  }

  const duration = Number(formState.duration);
  if (!duration || duration < 1) {
    return "Duration must be at least 1 minute.";
  }

  if (duration > 999) {
    return "Duration cannot be greater than 999 minutes";
  }

  const sets = Number(formState.sets);
  if (!sets || sets < 1) {
    return "Sets must be at least 1.";
  }

  const reps = Number(formState.reps);
  if (!reps || reps < 1) {
    return "Reps must be at least 1.";
  }

  const weightKg = Number(formState.weightKg);
  if (!Number.isFinite(weightKg) || weightKg < 0) {
    return "Weight must be 0 or higher.";
  }

  if ((formState.description || "").trim().length > 255) {
    return "Description cannot be longer than 255 characters";
  }

  if ((formState.notes || "").trim().length > 1000) {
    return "Notes cannot be longer than 1000 characters";
  }

  return "";
}
