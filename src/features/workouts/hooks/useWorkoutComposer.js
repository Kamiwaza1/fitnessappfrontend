"use client";

import { useState } from "react";
import { getTodayIsoDate } from "@/shared/utils/date";
import { createWorkout, updateWorkout } from "@/features/workouts/api/workoutsApi";
import { validateWorkoutForm } from "@/features/workouts/utils/workoutValidation";

const initialFormState = () => ({
  title: "",
  description: "",
  category: "GENERAL",
  date: getTodayIsoDate(),
  exercises: [
    {
      name: "",
      muscleType: "FULL_BODY",
      sets: "3",
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
      date: workout.workoutDate || workout.date || getTodayIsoDate(),
      exercises:
        Array.isArray(workout.exercises) && workout.exercises.length > 0
          ? workout.exercises.map((exercise) => ({
              name: exercise.name || "",
              muscleType: exercise.muscleType || "FULL_BODY",
              sets: String(exercise.sets ?? "3"),
            }))
          : [
              {
                name: workout.title || "",
                muscleType: workout.muscleType || "FULL_BODY",
                sets: String(workout.sets || "3"),
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
