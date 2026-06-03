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
          <form onSubmit={onJoinRoom} className="rounded-xl border border-primary/15 bg-primary/5 p-2">
            <div className="mb-2 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-icons text-sm">sensors</span>
              Join Live Room
            </div>
            <div className="flex min-w-0 gap-2">
            <input
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-primary/20 bg-background-light px-3 py-2 text-sm font-semibold uppercase tracking-widest text-slate-900 outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-36 dark:bg-background-dark dark:text-slate-100"
              placeholder="Room code"
              value={joinRoomCode}
              onChange={(event) => onJoinRoomCodeChange(event.target.value)}
              maxLength={12}
            />
            <button
              type="submit"
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
            >
              <span className="material-icons text-sm">login</span>
              <span>Join</span>
            </button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
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
      </div>
    </header>
  );
}
