"use client";

import { useWorkoutComposer } from "@/features/workouts/hooks/useWorkoutComposer";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import WorkoutComposerForm from "@/features/workouts/components/WorkoutComposerForm";
import WorkoutList from "@/features/workouts/components/WorkoutList";
import WorkoutPageHeader from "@/features/workouts/components/WorkoutPageHeader";
import AppPageShell from "@/shared/components/AppPageShell";

export default function WorkoutsPage() {
  const { workouts, isLoading, error, prependWorkout, removeWorkout } = useWorkoutList();
  const {
    isComposerOpen,
    formState,
    isSubmitting,
    submitError,
    setIsComposerOpen,
    setFormState,
    resetComposer,
    closeComposer,
    submitWorkout,
  } = useWorkoutComposer({
    onWorkoutCreated: prependWorkout,
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

      <section className="custom-scrollbar flex-1 overflow-y-auto p-5 pb-36 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {isComposerOpen ? (
            <WorkoutComposerForm
              formState={formState}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onChange={(field, value) =>
                setFormState((current) => ({
                  ...current,
                  [field]: value,
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
          />
        </div>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-primary/10 bg-background-dark/80 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Planner Status</p>
          <p className="text-sm text-slate-300">Workout planner ready</p>
        </div>
      </footer>
    </AppPageShell>
  );
}
