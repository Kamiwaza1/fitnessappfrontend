"use client";

import { useEffect, useState } from "react";
import { deleteWorkout, fetchWorkouts } from "@/features/workouts/api/workoutsApi";

export function useWorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadWorkouts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const nextWorkouts = await fetchWorkouts();
        if (!isMounted) return;
        setWorkouts(nextWorkouts);
      } catch (loadError) {
        if (!isMounted) return;
        setWorkouts([]);
        setError(loadError.message || "Could not load workouts right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  const prependWorkout = (workout) => {
    setWorkouts((current) => [workout, ...current]);
  };

  const removeWorkout = async (workoutId) => {
    await deleteWorkout(workoutId);
    setWorkouts((current) => current.filter((workout) => workout.id !== workoutId));
  };

  return {
    workouts,
    isLoading,
    error,
    prependWorkout,
    removeWorkout,
  };
}
