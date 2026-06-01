import Link from "next/link";

export default function WorkoutPageHeader({ onCreateWorkout }) {
  return (
    <header className="border-b border-primary/10 bg-background-light px-3 py-4 sm:px-6 lg:px-8 dark:bg-background-dark/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
            Workout Builder
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Plan a New Workout</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Build your session, add exercises, then save it to your schedule.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <Link
            href="/workout-histories"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20 sm:px-4"
          >
            <span className="material-icons text-sm">history</span>
            <span className="truncate">Histories</span>
          </Link>
          <button
            type="button"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-background shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01] sm:px-4"
            onClick={onCreateWorkout}
          >
            <span className="material-icons text-sm">add_circle</span>
            <span className="truncate">Add Workout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
