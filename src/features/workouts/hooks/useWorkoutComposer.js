"use client";

import { useState } from "react";
import { getTodayIsoDate } from "@/shared/utils/date";
import { createWorkout, updateWorkout } from "@/features/workouts/api/workoutsApi";
import { validateWorkoutForm } from "@/features/workouts/utils/workoutValidation";

const initialFormState = () => ({
  title: "",
  description: "",
  category: "GENERAL",
  muscleType: "FULL_BODY",
  date: getTodayIsoDate(),
  duration: "60",
  notes: "",
  exercises: [
    {
      name: "",
      muscleType: "FULL_BODY",
      sets: "3",
      reps: "10",
      weightKg: "20",
      notes: "",
    },
  ],
});

export function useWorkoutComposer({ onWorkoutCreated }) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const resetComposer = () => {
    setFormState(initialFormState());
    setEditingWorkoutId(null);
    setSubmitError("");
  };

  const openComposerForEdit = (workout) => {
    setEditingWorkoutId(workout.id);
    setFormState({
      title: workout.title || "",
      description: workout.description || workout.goal || "",
      category: workout.category || "GENERAL",
      muscleType: workout.muscleType || "FULL_BODY",
      date: workout.workoutDate || workout.date || getTodayIsoDate(),
      duration: String(workout.durationMinutes || workout.duration || "60"),
      notes: workout.notes || "",
      exercises:
        Array.isArray(workout.exercises) && workout.exercises.length > 0
          ? workout.exercises.map((exercise) => ({
              name: exercise.name || "",
              muscleType: exercise.muscleType || "FULL_BODY",
              sets: String(exercise.sets ?? "3"),
              reps: String(exercise.reps ?? "10"),
              weightKg: String(exercise.weightKg ?? "20"),
              notes: exercise.notes || "",
            }))
          : [
              {
                name: workout.title || "",
                muscleType: workout.muscleType || "FULL_BODY",
                sets: String(workout.sets || "3"),
                reps: String(workout.reps || "10"),
                weightKg: String(workout.weightKg || "20"),
                notes: "",
              },
            ],
    });
    setSubmitError("");
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    resetComposer();
  };

  const submitWorkout = async (event) => {
    event.preventDefault();

    const validationError = validateWorkoutForm(formState);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const workout = editingWorkoutId
        ? await updateWorkout({ workoutId: editingWorkoutId, formState })
        : await createWorkout({ formState });

      onWorkoutCreated(workout);
      resetComposer();
      setIsComposerOpen(false);
    } catch (error) {
      setSubmitError(error.message || "Could not save workout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isComposerOpen,
    formState,
    isSubmitting,
    submitError,
    setIsComposerOpen,
    setFormState,
    editingWorkoutId,
    resetComposer,
    closeComposer,
    openComposerForEdit,
    submitWorkout,
  };
}
