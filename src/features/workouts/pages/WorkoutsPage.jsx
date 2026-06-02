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
            />
          ) : null}

          <WorkoutList
            workouts={workouts}
            isLoading={isLoading}
            error={error}
            onDelete={handleDeleteWorkout}
            onEdit={openComposerForEdit}
            onStart={workoutSession.startWorkout}
            onStartLive={handleStartLiveWorkout}
          />
        </div>
      </section>

    </AppPageShell>
  );
}
