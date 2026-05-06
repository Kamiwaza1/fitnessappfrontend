export default function WorkoutComposerForm({
  formState,
  editingWorkoutId,
  submitError,
  isSubmitting,
  onChange,
  onReset,
  onClose,
  onSubmit,
}) {
  return (
    <form
      className="grid grid-cols-1 gap-4 rounded-2xl border border-primary/20 bg-background-light p-5 text-slate-900 shadow-sm sm:p-6 md:grid-cols-2 dark:bg-background-dark dark:text-slate-100"
      onSubmit={onSubmit}
    >
      <div className="md:col-span-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">
            {editingWorkoutId ? "Edit Workout Details" : "New Workout Details"}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Set your session details and pick your exercises.
          </p>
        </div>
        <button
          type="button"
          className="h-9 w-9 rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          onClick={onClose}
        >
          <span className="material-icons text-base">close</span>
        </button>
      </div>

      <label className="md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Workout Title</span>
        <input
          required
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Push Day - Heavy"
          value={formState.title}
          onChange={(event) => onChange("title", event.target.value)}
        />
      </label>

      <label className="md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Category</span>
        <select
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option value="GENERAL">General</option>
          <option value="STRENGTH">Strength</option>
          <option value="CARDIO">Cardio</option>
          <option value="MOBILITY">Mobility</option>
          <option value="RECOVERY">Recovery</option>
        </select>
      </label>

      <label className="md:col-span-1">
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</span>
        <input
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Push day focus and intensity"
          value={formState.description}
          onChange={(event) => onChange("description", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Workout Date</span>
        <input
          type="date"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.date}
          onChange={(event) => onChange("date", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Duration (mins)</span>
        <input
          type="number"
          min="1"
          max="999"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.duration}
          onChange={(event) => onChange("duration", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sets</span>
        <input
          type="number"
          min="1"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.sets}
          onChange={(event) => onChange("sets", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Reps</span>
        <input
          type="number"
          min="1"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.reps}
          onChange={(event) => onChange("reps", event.target.value)}
        />
      </label>

      <label>
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Weight (kg)</span>
        <input
          type="number"
          min="0"
          step="0.1"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.weightKg}
          onChange={(event) => onChange("weightKg", event.target.value)}
        />
      </label>

      <label className="md:col-span-2">
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Coaching Notes</span>
        <textarea
          rows="3"
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Start with activation warm-up and keep rest under 90 seconds."
          value={formState.notes}
          onChange={(event) => onChange("notes", event.target.value)}
        />
      </label>

      <div className="md:col-span-2 mt-1 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {submitError ? <p className="mr-auto text-sm text-red-400">{submitError}</p> : null}
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
          {isSubmitting ? "Saving..." : editingWorkoutId ? "Update Workout" : "Save Workout"}
        </button>
      </div>
    </form>
  );
}
