"use client";

import { useState } from "react";
import { getTodayIsoDate } from "@/shared/utils/date";
import { createWorkout } from "@/features/workouts/api/workoutsApi";
import { validateWorkoutForm } from "@/features/workouts/utils/workoutValidation";

const initialFormState = () => ({
  title: "",
  goal: "",
  date: getTodayIsoDate(),
  duration: "60",
  notes: "",
});

export function useWorkoutComposer({ onWorkoutCreated }) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const resetComposer = () => {
    setFormState(initialFormState());
    setSubmitError("");
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
      const workout = await createWorkout({ formState });
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
    resetComposer,
    closeComposer,
    submitWorkout,
  };
}
