export default function WorkoutPageHeader({ onCreateWorkout }) {
  return (
    <header className="border-b border-primary/10 bg-background-light px-5 py-5 sm:px-8 dark:bg-background-dark/30">
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background-light p-5 sm:p-6 md:flex-row md:items-center md:justify-between dark:bg-background-dark/40">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
            Workout Builder
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Plan a New Workout</h1>
          <p className="mt-1 text-sm text-slate-400">
            Build your session, add exercises, then save it to your schedule.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-background shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01]"
          onClick={onCreateWorkout}
        >
          <span className="material-icons text-sm">add_circle</span>
          Add New Workout
        </button>
      </div>
    </header>
  );
}
