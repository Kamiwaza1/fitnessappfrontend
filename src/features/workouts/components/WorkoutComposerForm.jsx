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
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Muscle Type</span>
        <select
          className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          value={formState.muscleType}
          onChange={(event) => onChange("muscleType", event.target.value)}
        >
          <option value="FULL_BODY">Full Body</option>
          <option value="CHEST">Chest</option>
          <option value="BACK">Back</option>
          <option value="SHOULDERS">Shoulders</option>
          <option value="BICEPS">Biceps</option>
          <option value="TRICEPS">Triceps</option>
          <option value="LEGS">Legs</option>
          <option value="GLUTES">Glutes</option>
          <option value="CORE">Core</option>
          <option value="CALVES">Calves</option>
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

      <div className="md:col-span-2 space-y-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Exercises</h3>
          <button
            type="button"
            className="rounded-md border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10"
            onClick={onAddExercise}
          >
            Add Exercise
          </button>
        </div>

        {(formState.exercises || []).map((exercise, index) => (
          <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-6 dark:border-slate-700">
            <input
              className="rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm md:col-span-2 dark:border-slate-700 dark:bg-slate-900/70"
              placeholder="Exercise name"
              value={exercise.name}
              onChange={(event) => onExerciseChange(index, "name", event.target.value)}
            />
            <select
              className="rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
              value={exercise.muscleType}
              onChange={(event) => onExerciseChange(index, "muscleType", event.target.value)}
            >
              <option value="FULL_BODY">Full Body</option>
              <option value="CHEST">Chest</option>
              <option value="BACK">Back</option>
              <option value="SHOULDERS">Shoulders</option>
              <option value="BICEPS">Biceps</option>
              <option value="TRICEPS">Triceps</option>
              <option value="LEGS">Legs</option>
              <option value="GLUTES">Glutes</option>
              <option value="CORE">Core</option>
              <option value="CALVES">Calves</option>
            </select>
            <input
              type="number"
              min="1"
              className="rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(event) => onExerciseChange(index, "sets", event.target.value)}
            />
            <input
              type="number"
              min="1"
              className="rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(event) => onExerciseChange(index, "reps", event.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
                placeholder="Weight kg"
                value={exercise.weightKg}
                onChange={(event) => onExerciseChange(index, "weightKg", event.target.value)}
              />
              <button
                type="button"
                className="rounded-md border border-red-500/40 px-2 text-red-400 hover:bg-red-500/10"
                onClick={() => onRemoveExercise(index)}
                disabled={(formState.exercises || []).length <= 1}
              >
                <span className="material-icons text-sm">remove</span>
              </button>
            </div>
            <textarea
              rows="2"
              className="rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm md:col-span-6 dark:border-slate-700 dark:bg-slate-900/70"
              placeholder="Exercise notes (optional)"
              value={exercise.notes || ""}
              onChange={(event) => onExerciseChange(index, "notes", event.target.value)}
            />
          </div>
        ))}
      </div>

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
