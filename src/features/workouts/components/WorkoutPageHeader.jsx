import Link from "next/link";

export default function WorkoutPageHeader({ joinRoomCode, onCreateWorkout, onJoinRoom, onJoinRoomCodeChange }) {
  return (
    <header className="border-b border-primary/10 bg-background-light px-3 py-4 sm:px-6 lg:px-8 dark:bg-background-dark/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
            Workout Builder
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Plan a New Workout</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Build your session, add exercises, then save it to your schedule.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-bold text-background transition-colors hover:bg-primary/90 sm:px-4"
              onClick={onCreateWorkout}
            >
              <span className="truncate">Add Workout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
