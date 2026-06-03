export default function WorkoutListItem({ workout, onDelete, onEdit, onStart, onStartLive }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-base font-bold">{workout.title}</h4>
          <p className="mt-1 text-sm text-slate-300">
            {workout.goal || "No goal added"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start">
          <span className="rounded bg-primary/15 px-2 py-1 text-[11px] uppercase tracking-widest text-primary">
            {workout.status}
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary text-background transition-colors hover:bg-primary/90"
            onClick={() => onStart(workout)}
            aria-label="Start workout"
          >
            <span className="material-icons text-sm">play_arrow</span>
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 text-primary transition-colors hover:bg-primary/10"
            onClick={() => onEdit(workout)}
            aria-label="Edit workout"
          >
            <span className="material-icons text-sm">edit</span>
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10"
            onClick={() => onDelete(workout.id)}
            aria-label="Delete workout"
          >
            <span className="material-icons text-sm">delete</span>
          </button>
        </div>
      </div>
      <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
        <span>{workout.date || "Date not set"}</span>
        <span>{(workout.exercises || []).length} exercises</span>
      </p>

      {(workout.exercises || []).length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {workout.exercises.slice(0, 4).map((exercise) => (
            <span key={exercise.id} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300">
              {exercise.name} {exercise.sets ? `· ${exercise.sets} sets` : ""} · {exercise.muscleType}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
          onClick={() => onStartLive(workout)}
        >
          <span className="material-icons text-base">sensors</span>
          Start Live
        </button>
      </div>
    </article>
  );
}
