"use client";

import AppPageShell from "@/shared/components/AppPageShell";
import { formatLongDate } from "@/shared/utils/date";

const MEALS = [
  { name: "Breakfast", icon: "wb_twilight" },
  { name: "Lunch", icon: "light_mode" },
  { name: "Snacks", icon: "cookie" },
];

const SUPPLEMENTS = [
  { name: "Creatine", amount: "5g" },
  { name: "Multivitamin", amount: "1 tab" },
  { name: "Omega-3", amount: "2 caps" },
  { name: "Vitamin D", amount: "1000 IU" },
];

function MealSection({ name, icon }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/5 dark:bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2 text-primary">
            <span className="material-icons text-sm">{icon}</span>
          </div>
          <h2 className="text-lg font-bold">{name}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-bold">0 kcal</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">P: 0g | C: 0g | F: 0g</div>
          </div>
          <button className="rounded bg-primary p-1.5 text-background transition-transform hover:scale-105">
            <span className="material-icons text-base leading-none">add</span>
          </button>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        <div className="p-8 text-center text-sm text-slate-500">No food logged for {name.toLowerCase()}.</div>
      </div>
    </section>
  );
}

export default function NutritionPage() {
  return (
    <AppPageShell>
      <div className="mx-auto max-w-[1600px] flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <button className="rounded-lg bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20">
              <span className="material-icons">chevron_left</span>
            </button>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold leading-none text-slate-900 dark:text-white">
                Today&apos;s Diary
              </h1>
              <p suppressHydrationWarning className="mt-1 text-sm text-slate-500 dark:text-primary/60">
                {formatLongDate()}
              </p>
            </div>
            <button className="rounded-lg bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20">
              <span className="material-icons">chevron_right</span>
            </button>
          </div>

          <div className="flex max-w-2xl flex-1 items-center justify-around rounded-xl border border-white/5 bg-slate-900/40 p-4 dark:bg-white/5">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Consumed
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2,500</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Remaining
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-6">
              {[
                ["Protein", "0g/180g", "bg-primary", "text-primary"],
                ["Carbs", "0g/250g", "bg-sky-400", "text-sky-400"],
                ["Fats", "0g/70g", "bg-amber-400", "text-amber-400"],
              ].map(([label, value, barClass, textClass]) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                    <span>{label}</span>
                    <span className={textClass}>{value}</span>
                  </div>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full ${barClass}`} style={{ width: "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-6 lg:col-span-8">
            {MEALS.map((meal) => (
              <MealSection key={meal.name} {...meal} />
            ))}

            <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/5 dark:bg-slate-900/50">
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
                <div className="rounded-lg bg-primary/20 p-2 text-primary">
                  <span className="material-icons text-sm">pill</span>
                </div>
                <h2 className="text-lg font-bold">Supplements</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                {SUPPLEMENTS.map((supplement) => (
                  <div
                    key={supplement.name}
                    className="flex flex-col items-center rounded-lg bg-primary/10 p-3 text-xs"
                  >
                    <span className="material-icons mb-1 text-base text-primary">pill</span>
                    <span className="font-bold">{supplement.name}</span>
                    <span className="text-[10px] text-slate-500">{supplement.amount}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="col-span-12 space-y-6 lg:col-span-4">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-slate-900/50">
              <div className="relative mb-6">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  search
                </span>
                <input
                  className="w-full rounded-lg border-none bg-slate-100 py-3 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-primary dark:bg-background-dark"
                  placeholder="Search foods database..."
                  type="text"
                />
              </div>
              <div className="border-t border-slate-100 pt-6 dark:border-white/5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Insights
                </h3>
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                  <div className="flex gap-3">
                    <span className="material-icons text-primary">tips_and_updates</span>
                    <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-300">
                      Start logging your meals to get personalized nutrition insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-slate-900/50">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-sky-400">water_drop</span>
                  <span className="text-sm font-bold">Water Intake</span>
                </div>
                <span className="text-sm font-bold text-sky-400">0 / 3L</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="h-3 flex-1 rounded-full bg-sky-400/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
