const muscleOptions = [
  ["FULL_BODY", "Full Body"],
  ["CHEST", "Chest"],
  ["BACK", "Back"],
  ["SHOULDERS", "Shoulders"],
  ["BICEPS", "Biceps"],
  ["TRICEPS", "Triceps"],
  ["LEGS", "Legs"],
  ["GLUTES", "Glutes"],
  ["CORE", "Core"],
  ["CALVES", "Calves"],
];

function FieldLabel({ children }) {
  return <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{children}</span>;
}

const inputClassName =
  "mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500";

export default function WorkoutComposerForm({
  formState,
  editingWorkoutId,
  submitError,
  isSubmitting,
  onChange,
  onExerciseChange,
  onAddExercise,
  onRemoveExercise,
  onReset,
  onClose,
  onSubmit,
}) {
  const exercises = formState.exercises || [];

  return (
    <form
      className="overflow-hidden rounded-xl border border-primary/20 bg-background-light text-slate-900 shadow-sm dark:bg-background-dark dark:text-slate-100"
      onSubmit={onSubmit}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 sm:p-5 dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {editingWorkoutId ? "Edit Workout" : "Create Workout"}
          </p>
          <h2 className="mt-1 text-xl font-bold">
            {editingWorkoutId ? "Update your plan" : "Build a workout plan"}
          </h2>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          onClick={onClose}
          aria-label="Close workout form"
        >
          <span className="material-icons text-base">close</span>
        </button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <section className="space-y-4 border-b border-slate-200 p-4 sm:p-5 lg:border-b-0 lg:border-r dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Session</h3>
          </div>

          <label className="block">
            <FieldLabel>Workout Title</FieldLabel>
            <input
              required
              className={inputClassName}
              placeholder="Push Day - Heavy"
              value={formState.title}
              onChange={(event) => onChange("title", event.target.value)}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block">
              <FieldLabel>Category</FieldLabel>
              <select
                className={inputClassName}
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
            <label className="block">
              <FieldLabel>Workout Date</FieldLabel>
              <input
                type="date"
                className={inputClassName}
                value={formState.date}
                onChange={(event) => onChange("date", event.target.value)}
              />
            </label>
          </div>

          <label className="block">
            <FieldLabel>Description</FieldLabel>
            <input
              className={inputClassName}
              placeholder="Push day focus and intensity"
              value={formState.description}
              onChange={(event) => onChange("description", event.target.value)}
            />
          </label>
        </section>

        <section className="space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Exercises</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{exercises.length} movements</p>
            </div>
            <button
              type="button"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-primary/40 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10"
              onClick={onAddExercise}
            >
              <span className="material-icons text-base">add</span>
              Add Exercise
            </button>
          </div>

          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <article key={index} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    Exercise {index + 1}
                  </span>
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => onRemoveExercise(index)}
                    disabled={exercises.length <= 1}
                    aria-label="Remove exercise"
                  >
                    <span className="material-icons text-sm">remove</span>
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-6">
                  <input
                    className={`${inputClassName} mt-0 md:col-span-3`}
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={(event) => onExerciseChange(index, "name", event.target.value)}
                  />
                  <select
                    className={`${inputClassName} mt-0 md:col-span-3`}
                    value={exercise.muscleType}
                    onChange={(event) => onExerciseChange(index, "muscleType", event.target.value)}
                  >
                    {muscleOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    className={`${inputClassName} mt-0 md:col-span-6`}
                    placeholder="Sets"
                    value={exercise.sets}
                    onChange={(event) => onExerciseChange(index, "sets", event.target.value)}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-background-light/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end dark:border-slate-800 dark:bg-background-dark/95">
        {submitError ? <p className="mr-auto text-sm font-semibold text-red-400">{submitError}</p> : null}
        <button
          type="button"
          className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={onReset}
          disabled={isSubmitting}
        >
          Reset
        </button>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-primary px-6 py-2 font-bold text-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : editingWorkoutId ? "Update Workout" : "Save Workout"}
        </button>
      </div>
    </form>
  );
}
