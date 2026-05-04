export default function WorkoutListItem({ workout, onDelete }) {
  return (
    <article className="rounded-xl border border-primary/15 bg-slate-950/40 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-base font-bold">{workout.title}</h4>
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary/15 px-2 py-1 text-[11px] uppercase tracking-widest text-primary">
            {workout.status}
          </span>
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
      <p className="mb-2 text-sm text-slate-300">
        {workout.goal || "No goal added"} • {workout.duration} mins • {workout.date || "Date not set"}
      </p>
      <p className="text-xs text-slate-400">
        {workout.exercises.length} exercises • {workout.notes || "No notes"}
      </p>
    </article>
  );
}
