import WorkoutListItem from "@/features/workouts/components/WorkoutListItem";
import StatusMessage from "@/shared/components/StatusMessage";

export default function WorkoutList({ workouts, isLoading, error, onDelete }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-background-light p-5 sm:p-6 dark:bg-background-dark/40">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold">Upcoming Workouts</h3>
        <span className="text-xs uppercase tracking-widest text-slate-400">
          {workouts.length} scheduled
        </span>
      </div>

      {isLoading ? <StatusMessage className="mx-auto max-w-md py-8">Loading workouts...</StatusMessage> : null}
      {!isLoading && error ? (
        <StatusMessage className="mx-auto max-w-md py-8" tone="error">
          {error}
        </StatusMessage>
      ) : null}
      {!isLoading && !error && workouts.length === 0 ? (
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
      {!isLoading && !error && workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutListItem key={workout.id} workout={workout} onDelete={onDelete} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
