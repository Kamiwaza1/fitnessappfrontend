"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { saveWorkoutSession } from "@/features/workouts/api/workoutsApi";
import { toIsoLocalDate } from "@/shared/utils/date";

const ACTIVE_SESSION_KEY = "darklift.activeWorkoutSession";
const DEFAULT_REST_SECONDS = 90;

function createSetId() {
  return `set-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSession(workout) {
  return {
    id: `session-${Date.now()}`,
    workoutId: workout.id,
    title: workout.title || workout.name || "Workout",
    startedAt: new Date().toISOString(),
    exercises: (workout.exercises || []).map((exercise, index) => ({
      id: String(exercise.id || `${exercise.name || "exercise"}-${index}`),
      name: exercise.name || `Exercise ${index + 1}`,
      muscleType: exercise.muscleType || "FULL_BODY",
      targetSets: exercise.sets,
      targetReps: exercise.reps,
      targetWeightKg: exercise.weightKg,
      notes: exercise.notes || "",
      completed: false,
      loggedSets: [],
    })),
  };
}

function isSessionCurrent(session) {
  if (!session?.startedAt) return false;
  const startedAt = new Date(session.startedAt);
  if (Number.isNaN(startedAt.getTime())) return false;
  return toIsoLocalDate(startedAt) === toIsoLocalDate();
}

function readStoredSession() {
  if (typeof window === "undefined") return null;

  try {
    const storedSession = window.localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!storedSession) return null;

    const parsedSession = JSON.parse(storedSession);
    if (!isSessionCurrent(parsedSession)) {
      window.localStorage.removeItem(ACTIVE_SESSION_KEY);
      return null;
    }

    return parsedSession;
  } catch {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    return null;
  }
}

function toSessionPayload(session) {
  const finishedAt = new Date();
  const loggedSets = session.exercises.flatMap((exercise) =>
    exercise.loggedSets.map((set) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: Number(set.reps) || 0,
      weightKg: Number(set.weightKg) || 0,
      completedAt: set.completedAt,
    }))
  );

  return {
    workoutId: session.workoutId,
    workoutName: session.title,
    workoutDate: finishedAt.toISOString().slice(0, 10),
    startedAt: session.startedAt,
    finishedAt: finishedAt.toISOString(),
    sets: loggedSets.length,
    reps: loggedSets.reduce((sum, set) => sum + set.reps, 0),
    weightKg: loggedSets.reduce((max, set) => Math.max(max, set.weightKg), 0),
    exercises: session.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      muscleType: exercise.muscleType,
      completed: exercise.completed,
      loggedSets: exercise.loggedSets,
    })),
  };
}

export function useActiveWorkoutSession() {
  const [activeSession, setActiveSession] = useState(null);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  const [restDurationSeconds, setRestDurationSeconds] = useState(DEFAULT_REST_SECONDS);
  const [restEndsAt, setRestEndsAt] = useState(null);
  const [timerTick, setTimerTick] = useState(0);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const restoreSessionTimeout = window.setTimeout(() => {
      setActiveSession(readStoredSession());
      setHasRestoredSession(true);
    }, 0);

    return () => window.clearTimeout(restoreSessionTimeout);
  }, []);

  useEffect(() => {
    if (!hasRestoredSession) return;

    if (!activeSession) {
      window.localStorage.removeItem(ACTIVE_SESSION_KEY);
      return;
    }

    window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
  }, [activeSession, hasRestoredSession]);

  useEffect(() => {
    if (!restEndsAt) return undefined;

    const intervalId = window.setInterval(() => setTimerTick(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [restEndsAt]);

  const remainingRestSeconds = useMemo(
    () => (restEndsAt ? Math.max(0, Math.ceil((restEndsAt - timerTick) / 1000)) : 0),
    [restEndsAt, timerTick]
  );

  const startWorkout = useCallback((workout) => {
    setSaveError("");
    setActiveSession(createSession(workout));
  }, []);

  const startRestTimer = useCallback(() => {
    const now = Date.now();
    setTimerTick(now);
    setRestEndsAt(now + restDurationSeconds * 1000);
  }, [restDurationSeconds]);

  const addSet = useCallback((exerciseId, values) => {
    setActiveSession((session) => {
      if (!session) return session;

      return {
        ...session,
        exercises: session.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                loggedSets: [
                  ...exercise.loggedSets,
                  {
                    id: createSetId(),
                    reps: Number(values.reps) || 0,
                    weightKg: Number(values.weightKg) || 0,
                    completedAt: new Date().toISOString(),
                  },
                ],
              }
            : exercise
        ),
      };
    });
    startRestTimer();
  }, [startRestTimer]);

  const updateSet = useCallback((exerciseId, setId, values) => {
    setActiveSession((session) => {
      if (!session) return session;

      return {
        ...session,
        exercises: session.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                loggedSets: exercise.loggedSets.map((set) =>
                  set.id === setId
                    ? {
                        ...set,
                        reps: Number(values.reps) || 0,
                        weightKg: Number(values.weightKg) || 0,
                      }
                    : set
                ),
              }
            : exercise
        ),
      };
    });
  }, []);

  const removeSet = useCallback((exerciseId, setId) => {
    setActiveSession((session) => {
      if (!session) return session;

      return {
        ...session,
        exercises: session.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? { ...exercise, loggedSets: exercise.loggedSets.filter((set) => set.id !== setId) }
            : exercise
        ),
      };
    });
  }, []);

  const toggleExerciseCompleted = useCallback((exerciseId) => {
    setActiveSession((session) => {
      if (!session) return session;

      return {
        ...session,
        exercises: session.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, completed: !exercise.completed } : exercise
        ),
      };
    });
  }, []);

  const finishWorkout = useCallback(async () => {
    if (!activeSession) return;

    setIsSaving(true);
    setSaveError("");

    try {
      await saveWorkoutSession(toSessionPayload(activeSession));
      setActiveSession(null);
      setRestEndsAt(null);
    } catch (error) {
      setSaveError(error?.message || "Could not save workout session.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [activeSession]);

  const discardWorkout = useCallback(() => {
    setActiveSession(null);
    setRestEndsAt(null);
    setSaveError("");
  }, []);

  const totals = useMemo(() => {
    const sets = activeSession?.exercises.reduce((sum, exercise) => sum + exercise.loggedSets.length, 0) || 0;
    const reps =
      activeSession?.exercises.reduce(
        (sum, exercise) => sum + exercise.loggedSets.reduce((setSum, set) => setSum + Number(set.reps || 0), 0),
        0
      ) || 0;
    const completed = activeSession?.exercises.filter((exercise) => exercise.completed).length || 0;

    return { sets, reps, completed };
  }, [activeSession]);

  return {
    activeSession,
    remainingRestSeconds,
    restDurationSeconds,
    isSaving,
    saveError,
    totals,
    startWorkout,
    addSet,
    updateSet,
    removeSet,
    toggleExerciseCompleted,
    finishWorkout,
    discardWorkout,
    setRestDurationSeconds,
    restartRestTimer: startRestTimer,
  };
}
