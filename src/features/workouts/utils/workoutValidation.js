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

  if (!formState.category) {
    return "Workout category is required.";
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

  const exercises = Array.isArray(formState.exercises) ? formState.exercises : [];
  if (exercises.length === 0) {
    return "At least one exercise is required.";
  }
  for (const exercise of exercises) {
    const exerciseName = (exercise?.name || "").trim();
    if (!exerciseName) {
      return "Each exercise must have a name.";
    }
    const sets = Number(exercise?.sets);
    if (!sets || sets < 1) {
      return "Each exercise must have sets of at least 1.";
    }
    if (!exercise?.muscleType) {
      return "Each exercise must have a muscle type.";
    }
  }

  if ((formState.description || "").trim().length > 255) {
    return "Description cannot be longer than 255 characters";
  }

  return "";
}
