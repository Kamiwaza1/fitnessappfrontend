import WorkoutListItem from "@/features/workouts/components/WorkoutListItem";
import StatusMessage from "@/shared/components/StatusMessage";
import { toIsoLocalDate } from "@/shared/utils/date";

export default function WorkoutList({ workouts, activeWorkoutId = null, isLoading, error, onDelete, onEdit, onStart }) {
  const today = toIsoLocalDate();
  const upcomingWorkouts = workouts.filter((workout) => {
    const workoutDate = String(workout?.workoutDate || workout?.date || "").slice(0, 10);
    return workoutDate >= today && String(workout?.id) !== String(activeWorkoutId || "");
  });

  return (
    <div className="rounded-xl border border-primary/10 bg-background-light p-4 sm:p-5 dark:bg-background-dark/40">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">Upcoming Workouts</h3>
        <span className="shrink-0 text-xs uppercase tracking-widest text-slate-400">
          {upcomingWorkouts.length} scheduled
        </span>
      </div>

      {isLoading ? <StatusMessage className="mx-auto max-w-md py-8">Loading workouts...</StatusMessage> : null}
      {!isLoading && error ? (
        <StatusMessage className="mx-auto max-w-md py-8" tone="error">
          {error}
        </StatusMessage>
      ) : null}
      {!isLoading && !error && upcomingWorkouts.length === 0 ? (
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-icons text-3xl">event_available</span>
          </div>
          <h4 className="mb-2 text-lg font-bold">No Workouts Scheduled</h4>
          <p className="text-sm text-slate-400">
            Open the builder and create your first workout plan for this week.
          </p>
        </div>
      ) : null}
      {!isLoading && !error && upcomingWorkouts.length > 0 ? (
        <div className="space-y-4">
          {upcomingWorkouts.map((workout) => (
            <WorkoutListItem
              key={workout.id}
              workout={workout}
              onDelete={onDelete}
              onEdit={onEdit}
              onStart={onStart}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
