"use client";

import AppPageShell from "@/shared/components/AppPageShell";

export default function ProgressPage() {
  return (
    <AppPageShell>
      <div className="mx-auto max-w-7xl flex-1 p-8">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              Progress &amp; <span className="text-primary">Insights</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Long-term performance analysis and physical metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-slate-200 p-1 dark:bg-white/5">
              {["7D", "30D", "3M", "1Y"].map((range) => (
                <button
                  key={range}
                  className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                    range === "30D"
                      ? "bg-primary text-background"
                      : "hover:bg-white/10"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/30">
              <span className="material-icons text-sm">download</span> Export
            </button>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Volume
              </span>
              <span className="material-icons text-primary">fitness_center</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">0</span>
              <span className="mb-1.5 flex items-center text-xs font-medium text-slate-500">
                -- %
              </span>
            </div>
            <p className="mt-1 text-xs italic text-slate-500">lbs moved this month</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <div className="h-full rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="material-icons text-sm text-primary">analytics</span> Volume Per
                Muscle Group
              </h3>
              <div className="relative flex aspect-square items-center justify-center p-4">
                <div className="text-sm text-slate-500">Not enough data for chart</div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-icons text-primary">psychology</span>
                <h4 className="text-sm font-bold tracking-tight">AI TRAINER INSIGHTS</h4>
              </div>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">•</span>
                  <p className="text-slate-300">
                    Keep logging your workouts to unlock personalized insights.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <span className="material-icons text-sm text-primary">show_chart</span> Body
                  Metric Trends
                </h3>
              </div>
              <div className="relative flex h-64 w-full items-center justify-center text-sm text-slate-500">
                No measurements recorded.
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-white/10">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <span className="material-icons text-sm text-primary">stars</span> Recent Personal
                  Records
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      <th className="px-6 py-4">Exercise</th>
                      <th className="px-6 py-4">Max Weight</th>
                      <th className="px-6 py-4">1RM Est.</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-xs text-slate-500">
                        No personal records yet. Crush some weights!
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
