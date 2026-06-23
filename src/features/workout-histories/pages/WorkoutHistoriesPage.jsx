"use client";

import { useWorkoutHistories } from "@/features/workout-histories/hooks/useWorkoutHistories";
import AppPageShell from "@/shared/components/AppPageShell";
import StatusMessage from "@/shared/components/StatusMessage";

export default function WorkoutHistoriesPage() {
  const { workoutHistories, isLoading, error } = useWorkoutHistories();

  return (
    <AppPageShell mainClassName="relative flex min-h-dvh flex-col">
      <section className="custom-scrollbar flex-1 p-4 pb-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          

          <div className="rounded-2xl border border-primary/10 bg-background-light p-5 sm:p-6 dark:bg-background-dark/40">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">History List</h2>
              <span className="text-xs uppercase tracking-widest text-slate-400">
                {workoutHistories.length} records
              </span>
            </div>

            {isLoading ? (
              <StatusMessage className="mx-auto max-w-md py-8">Loading workout histories...</StatusMessage>
            ) : null}

            {!isLoading && error ? (
              <StatusMessage className="mx-auto max-w-md py-8" tone="error">
                {error}
              </StatusMessage>
            ) : null}

            {!isLoading && !error && workoutHistories.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-icons">history</span>
                </div>
                <h3 className="mb-2 text-lg font-bold">No workout histories yet</h3>
                <p className="text-sm text-slate-400">Your completed workout sessions will appear here.</p>
              </div>
            ) : null}

            {!isLoading && !error && workoutHistories.length > 0 ? (
              <div className="space-y-3">
                {workoutHistories.map((history) => (
                  <article key={history.id} className="rounded-xl border border-primary/15 bg-slate-959/40 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold">{history.title}</h3>
                      <span className="rounded bg-primary/15 px-2 py-1 text-[11px] uppercase tracking-widest text-primary">
                        {history.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {history.durationMinutes ? `${history.durationMinutes} mins` : "Duration not set"} •{" "}
                      {history.date ? history.date : "Date not set"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {history.sets ?? "-"} sets • {history.reps ?? "-"} reps •{" "}
                      {history.weightKg ?? "-"} kg • {history.category}
                    </p>
                    {history.notes ? <p className="mt-1 text-xs text-slate-400">{history.notes}</p> : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </AppPageShell>
  );
}
