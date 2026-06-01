export default function WorkoutListItem({ workout, onDelete, onEdit }) {
  return (
    <article className="rounded-xl border border-primary/15 bg-slate-950/40 p-4">
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
        <span>{workout.duration} mins</span>
        <span>{workout.date || "Date not set"}</span>
      </p>
      
    </article>
  );
}
