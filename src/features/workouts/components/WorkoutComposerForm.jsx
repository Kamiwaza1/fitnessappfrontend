export default function WorkoutComposerForm({
  formState,
  submitError,
  isSubmitting,
  onChange,
  onReset,
  onClose,
  onSubmit,
}) {
  return (
    <form
      className="grid grid-cols-1 gap-4 rounded-2xl border border-primary/20 bg-slate-900/60 p-5 sm:p-6 md:grid-cols-2"
      onSubmit={onSubmit}
    >
      <div className="md:col-span-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">New Workout Details</h2>
          <p className="mt-1 text-sm text-slate-400">
            Set your session details and pick your exercises.
          </p>
        </div>
        <button
          type="button"
          className="h-9 w-9 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200"
          onClick={onClose}
        >
          <span className="material-icons text-base">close</span>
        </button>
      </div>

      <label className="md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Workout Title</span>
        <input
          required
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
          placeholder="Push Day - Heavy"
          value={formState.title}
          onChange={(event) => onChange("title", event.target.value)}
        />
      </label>

      <label className="md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-400">Primary Goal</span>
        <input
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
          placeholder="Strength / Hypertrophy"
          value={formState.goal}
          onChange={(event) => onChange("goal", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-400">Workout Date</span>
        <input
          type="date"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
          value={formState.date}
          onChange={(event) => onChange("date", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-400">Duration (mins)</span>
        <input
          type="number"
          min="20"
          max="180"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
          value={formState.duration}
          onChange={(event) => onChange("duration", event.target.value)}
        />
      </label>

      <label className="md:col-span-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">Coaching Notes</span>
        <textarea
          rows="3"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
          placeholder="Start with activation warm-up and keep rest under 90 seconds."
          value={formState.notes}
          onChange={(event) => onChange("notes", event.target.value)}
        />
      </label>

      <div className="md:col-span-2 mt-1 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {submitError ? <p className="mr-auto text-sm text-red-400">{submitError}</p> : null}
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800"
          onClick={onReset}
          disabled={isSubmitting}
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2 font-bold text-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Workout"}
        </button>
      </div>
    </form>
  );
}
