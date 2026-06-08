import { useMemo, useState } from "react";

function formatRest(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function ExerciseLogger({
  exercise,
  draft,
  onDraftChange,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onToggleCompleted,
}) {
  const targetText = [
    exercise.targetSets ? `${exercise.targetSets} target sets` : null,
    exercise.targetReps ? `${exercise.targetReps} target reps` : null,
    exercise.targetWeightKg ? `${exercise.targetWeightKg} kg planned` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-lg font-black text-slate-900 dark:text-white">{exercise.name}</h4>
          <p className="mt-1 text-sm text-slate-400">{targetText || "No planning target set"}</p>
          {exercise.notes ? <p className="mt-2 text-sm text-slate-500">{exercise.notes}</p> : null}
        </div>
        <button
          type="button"
          className={`flex min-h-10 shrink-0 items-center rounded-lg border px-3 text-sm font-bold transition-colors ${
            exercise.completed
              ? "border-primary bg-primary text-background"
              : "border-slate-300 text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
          onClick={() => onToggleCompleted(exercise.id)}
        >
          {exercise.completed ? "Done" : "Mark done"}
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
          <span className="material-icons text-base">post_add</span>
          Post-set entry
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label>
            <span className="text-xs uppercase tracking-wide text-slate-500">Actual reps</span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={draft.reps}
              onChange={(event) => onDraftChange(exercise.id, "reps", event.target.value)}
            />
          </label>
          <label>
            <span className="text-xs uppercase tracking-wide text-slate-500">Lift weight kg</span>
            <input
              type="number"
              min="0"
              step="0.5"
              inputMode="decimal"
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={draft.weightKg}
              onChange={(event) => onDraftChange(exercise.id, "weightKg", event.target.value)}
            />
          </label>
          <button
            type="button"
            className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 font-black text-background hover:bg-primary/90"
            onClick={() => onAddSet(exercise.id)}
          >
            Log set
          </button>
        </div>
      </div>

      {exercise.loggedSets.length ? (
        <div className="mt-4 space-y-2">
          {exercise.loggedSets.map((set, index) => (
            <div
              key={set.id}
              className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <span className="text-xs font-black uppercase text-slate-500">Set {index + 1}</span>
              <input
                type="number"
                min="1"
                className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={set.reps}
                aria-label={`Set ${index + 1} reps`}
                onChange={(event) =>
                  onUpdateSet(exercise.id, set.id, {
                    reps: event.target.value,
                    weightKg: set.weightKg,
                  })
                }
              />
              <input
                type="number"
                min="0"
                step="0.5"
                className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={set.weightKg}
                aria-label={`Set ${index + 1} lift weight`}
                onChange={(event) =>
                  onUpdateSet(exercise.id, set.id, {
                    reps: set.reps,
                    weightKg: event.target.value,
                  })
                }
              />
              <button
                type="button"
                className="rounded-md px-2 py-1 text-xs font-bold text-red-400 hover:bg-red-500/10"
                onClick={() => onRemoveSet(exercise.id, set.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function ActiveWorkoutSession({
  session,
  remainingRestSeconds,
  restDurationSeconds,
  totals,
  saveError,
  isSaving,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onToggleCompleted,
  onFinish,
  onDiscard,
  onRestDurationChange,
  onRestartRestTimer,
}) {
  const [drafts, setDrafts] = useState({});

  const completionText = useMemo(
    () => `${totals.completed} of ${session.exercises.length} exercises completed`,
    [session.exercises.length, totals.completed]
  );

  const handleDraftChange = (exerciseId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [exerciseId]: {
        reps: current[exerciseId]?.reps || "",
        weightKg: current[exerciseId]?.weightKg || "",
        [field]: value,
      },
    }));
  };

  const handleAddSet = (exerciseId) => {
    const exercise = session.exercises.find((item) => item.id === exerciseId);
    const draft = drafts[exerciseId] || {};
    const reps = draft.reps || exercise?.targetReps || "";
    const weightKg = draft.weightKg || exercise?.targetWeightKg || "0";

    if (!Number.isFinite(Number(reps)) || Number(reps) <= 0 || !Number.isFinite(Number(weightKg)) || Number(weightKg) < 0) {
      window.alert("Fill in the reps and lift weight after the set.");
      return;
    }

    onAddSet(exerciseId, { reps, weightKg });
    setDrafts((current) => ({
      ...current,
      [exerciseId]: {
        reps: String(reps),
        weightKg: String(weightKg),
      },
    }));
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-100 p-4 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <span className="rounded bg-primary/15 px-2 py-1 text-[11px] font-black uppercase tracking-widest text-primary">
            Active workout
          </span>
          <h2 className="mt-3 break-words text-2xl font-black">{session.title}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {completionText} · {totals.sets} sets logged · {totals.reps} total reps
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Rest timer</p>
              <p className="mt-1 text-4xl font-black tabular-nums text-primary">{formatRest(remainingRestSeconds)}</p>
            </div>
            <span className="material-icons text-3xl text-primary">timer</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[60, 90, 120, 180].map((seconds) => (
              <button
                key={seconds}
                type="button"
                className={`rounded-lg border px-3 py-2 text-xs font-black ${
                  restDurationSeconds === seconds
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-slate-300 text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
                onClick={() => onRestDurationChange(seconds)}
              >
                {seconds}s
              </button>
            ))}
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={onRestartRestTimer}
            >
              Restart
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {session.exercises.map((exercise) => (
          <ExerciseLogger
            key={exercise.id}
            exercise={exercise}
            draft={drafts[exercise.id] || { reps: "", weightKg: "" }}
            onDraftChange={handleDraftChange}
            onAddSet={handleAddSet}
            onUpdateSet={onUpdateSet}
            onRemoveSet={onRemoveSet}
            onToggleCompleted={onToggleCompleted}
          />
        ))}
      </div>

      {saveError ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{saveError}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="min-h-11 rounded-lg border border-slate-300 px-4 font-bold text-slate-600 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={onDiscard}
          disabled={isSaving}
        >
          Discard session
        </button>
        <button
          type="button"
          className="min-h-11 rounded-lg bg-primary px-6 font-black text-background hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onFinish}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Finish workout"}
        </button>
      </div>
    </section>
  );
}
