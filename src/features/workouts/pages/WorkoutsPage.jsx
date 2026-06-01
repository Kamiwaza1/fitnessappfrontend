"use client";

import { useWorkoutComposer } from "@/features/workouts/hooks/useWorkoutComposer";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import WorkoutComposerForm from "@/features/workouts/components/WorkoutComposerForm";
import WorkoutList from "@/features/workouts/components/WorkoutList";
import WorkoutPageHeader from "@/features/workouts/components/WorkoutPageHeader";
import AppPageShell from "@/shared/components/AppPageShell";

export default function WorkoutsPage() {
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

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await removeWorkout(workoutId);
    } catch (error) {
      window.alert(error?.message || "Could not delete workout. Please try again.");
    }
  };

  return (
    <AppPageShell mainClassName="relative flex h-screen flex-col overflow-hidden">
      <WorkoutPageHeader onCreateWorkout={() => setIsComposerOpen(true)} />

      <section className="custom-scrollbar flex-1 overflow-y-auto p-5 pb-8 sm:p-8">
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

          <WorkoutList
            workouts={workouts}
            isLoading={isLoading}
            error={error}
            onDelete={handleDeleteWorkout}
            onEdit={openComposerForEdit}
          />
        </div>
      </section>

    </AppPageShell>
  );
}
