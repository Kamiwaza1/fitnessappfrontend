"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLiveWorkoutRoom } from "@/features/live-workouts/api/liveWorkoutsApi";
import { useWorkoutComposer } from "@/features/workouts/hooks/useWorkoutComposer";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import WorkoutComposerForm from "@/features/workouts/components/WorkoutComposerForm";
import WorkoutList from "@/features/workouts/components/WorkoutList";
import WorkoutPageHeader from "@/features/workouts/components/WorkoutPageHeader";
import ActiveWorkoutSession from "@/features/workouts/components/ActiveWorkoutSession";
import { useActiveWorkoutSession } from "@/features/workouts/hooks/useActiveWorkoutSession";
import AppPageShell from "@/shared/components/AppPageShell";

export default function WorkoutsPage() {
  const router = useRouter();
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [workoutToStart, setWorkoutToStart] = useState(null);
  const { workouts, isLoading, error, upsertWorkout, removeWorkout } = useWorkoutList();
  const {
    isComposerOpen,
    formState,
    editingWorkoutId,
    isSubmitting,
    submitError,
    setIsComposerOpen,
    setFormState,
    resetComposer,
    closeComposer,
    openComposerForEdit,
    submitWorkout,
  } = useWorkoutComposer({
    onWorkoutCreated: upsertWorkout,
  });
  const workoutSession = useActiveWorkoutSession();

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await removeWorkout(workoutId);
    } catch (error) {
      window.alert(error?.message || "Could not delete workout. Please try again.");
    }
  };

  const handleStartLiveWorkout = async (workout) => {
    try {
      const room = await createLiveWorkoutRoom(workout.id);
      router.push(`/live-workouts/${room.roomCode}`);
    } catch (error) {
      window.alert(error?.message || "Could not start live workout. Please try again.");
    }
  };

  const handleJoinLiveWorkout = (event) => {
    event.preventDefault();
    const roomCode = joinRoomCode.trim().toUpperCase();
    if (!roomCode) return;
    router.push(`/live-workouts/${roomCode}`);
  };

  const handleConfirmStartWorkout = () => {
    if (!workoutToStart) return;
    workoutSession.startWorkout(workoutToStart);
    setWorkoutToStart(null);
  };

  return (
    <AppPageShell mainClassName="relative flex min-h-dvh flex-col">
      <WorkoutPageHeader
        joinRoomCode={joinRoomCode}
        onCreateWorkout={() => setIsComposerOpen(true)}
        onJoinRoom={handleJoinLiveWorkout}
        onJoinRoomCodeChange={setJoinRoomCode}
      />

      <section className="custom-scrollbar flex-1 p-3 pb-6 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {isComposerOpen ? (
            <WorkoutComposerForm
              formState={formState}
              editingWorkoutId={editingWorkoutId}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onChange={(field, value) =>
                setFormState((current) => ({
                  ...current,
                  [field]: value,
                }))
              }
              onExerciseChange={(index, field, value) =>
                setFormState((current) => ({
                  ...current,
                  exercises: (current.exercises || []).map((exercise, exerciseIndex) =>
                    exerciseIndex === index ? { ...exercise, [field]: value } : exercise
                  ),
                }))
              }
              onAddExercise={() =>
                setFormState((current) => ({
                  ...current,
                  exercises: [
                    ...(current.exercises || []),
                    {
                      name: "",
                      muscleType: "FULL_BODY",
                      sets: "3",
                      reps: "10",
                      weightKg: "20",
                      notes: "",
                    },
                  ],
                }))
              }
              onRemoveExercise={(index) =>
                setFormState((current) => ({
                  ...current,
                  exercises:
                    (current.exercises || []).length <= 1
                      ? current.exercises
                      : current.exercises.filter((_, exerciseIndex) => exerciseIndex !== index),
                }))
              }
              onReset={resetComposer}
              onClose={closeComposer}
              onSubmit={submitWorkout}
            />
          ) : null}

          {workoutSession.activeSession ? (
            <ActiveWorkoutSession
              session={workoutSession.activeSession}
              remainingRestSeconds={workoutSession.remainingRestSeconds}
              restDurationSeconds={workoutSession.restDurationSeconds}
              totals={workoutSession.totals}
              saveError={workoutSession.saveError}
              isSaving={workoutSession.isSaving}
              onAddSet={workoutSession.addSet}
              onUpdateSet={workoutSession.updateSet}
              onRemoveSet={workoutSession.removeSet}
              onToggleCompleted={workoutSession.toggleExerciseCompleted}
              onFinish={workoutSession.finishWorkout}
              onDiscard={workoutSession.discardWorkout}
              onRestDurationChange={workoutSession.setRestDurationSeconds}
              onRestartRestTimer={workoutSession.restartRestTimer}
              onStartLive={() => handleStartLiveWorkout({ id: workoutSession.activeSession.workoutId })}
            />
          ) : null}

          <WorkoutList
            workouts={workouts}
            activeWorkoutId={workoutSession.activeSession?.workoutId}
            isLoading={isLoading}
            error={error}
            onDelete={handleDeleteWorkout}
            onEdit={openComposerForEdit}
            onStart={setWorkoutToStart}
          />
        </div>
      </section>

      {workoutToStart ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="start-workout-title"
            className="w-full max-w-md rounded-xl border border-primary/20 bg-background-light p-5 text-slate-900 shadow-2xl dark:bg-slate-950 dark:text-white"
          >
            <span className="rounded bg-primary/15 px-2 py-1 text-[11px] font-black uppercase tracking-widest text-primary">
              Start workout
            </span>
            <h2 id="start-workout-title" className="mt-3 break-words text-2xl font-black">
              {workoutToStart.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Open this planned workout as your active session now. It will stay active for today until you finish or
              discard it.
            </p>
            <div className="mt-4 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <span>Date</span>
                <strong className="text-right text-slate-900 dark:text-white">{workoutToStart.date || "Not set"}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Exercises</span>
                <strong className="text-right text-slate-900 dark:text-white">
                  {(workoutToStart.exercises || []).length}
                </strong>
              </div>
              {workoutToStart.durationMinutes ? (
                <div className="flex items-center justify-between gap-3">
                  <span>Duration</span>
                  <strong className="text-right text-slate-900 dark:text-white">
                    {workoutToStart.durationMinutes} min
                  </strong>
                </div>
              ) : null}
            </div>
            {workoutSession.activeSession ? (
              <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-700 dark:text-amber-200">
                Starting this will replace your current active workout.
              </p>
            ) : null}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="min-h-11 rounded-lg border border-slate-300 px-4 font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                onClick={() => setWorkoutToStart(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="min-h-11 rounded-lg bg-primary px-5 font-black text-background hover:bg-primary/90"
                onClick={handleConfirmStartWorkout}
              >
                Start active workout
              </button>
            </div>
          </section>
        </div>
      ) : null}

    </AppPageShell>
  );
}
