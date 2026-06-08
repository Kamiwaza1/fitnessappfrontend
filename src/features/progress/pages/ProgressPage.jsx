"use client";

import { useMemo } from "react";
import AppPageShell from "@/shared/components/AppPageShell";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

export default function ProgressPage() {
  const { workouts } = useWorkoutList();
  const totalVolume = useMemo(
    () =>
      workouts.reduce((sum, workout) => {
        if (Array.isArray(workout?.exercises) && workout.exercises.length > 0) {
          return (
            sum +
            workout.exercises.reduce((exerciseSum, exercise) => {
              const sets = Number(exercise?.sets || 0);
              const reps = Number(exercise?.reps || 0);
              const weight = Number(exercise?.weightKg || 0);
              return exerciseSum + sets * reps * weight;
            }, 0)
          );
        }
        const sets = Number(workout?.sets || 0);
        const reps = Number(workout?.reps || 0);
        const weight = Number(workout?.weightKg || 0);
        return sum + sets * reps * weight;
      }, 0),
    [workouts]
  );

  const categoryData = useMemo(() => {
    const grouped = workouts.reduce((acc, workout) => {
      const key = workout?.category || "GENERAL";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, count]) => ({
      category,
      count,
    }));
  }, [workouts]);

  const durationTrendData = useMemo(
    () =>
      workouts
        .map((workout) => ({
          date: String(workout?.workoutDate || workout?.date || "").slice(5, 10),
          duration: Number(workout?.durationMinutes || workout?.duration || 0),
        }))
        .slice(-10),
    [workouts]
  );

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
            <button className="rounded-lg border border-primary/30 bg-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/30">
              Export
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <div className="h-full rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="material-icons text-sm text-primary">analytics</span> Volume Per
                Muscle Group
              </h3>
              <ChartContainer
                className="mx-auto aspect-square max-h-[260px] w-full"
                config={{
                  count: { label: "Workouts" },
                  GENERAL: { label: "General", color: "#0df259" },
                  STRENGTH: { label: "Strength", color: "#22c55e" },
                  CARDIO: { label: "Cardio", color: "#84cc16" },
                  MOBILITY: { label: "Mobility", color: "#16a34a" },
                  RECOVERY: { label: "Recovery", color: "#15803d" },
                }}
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
                  <Pie data={categoryData} dataKey="count" nameKey="category" outerRadius={90}>
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={
                          {
                            Chest: "#0df259",
                            Back: "#22c55e",
                            Legs: "#84cc16",
                            Arms: "#16a34a",
                            Shoulders: "#15803d",
                            Core: "#15803d" 
                          }[entry.category] || "#0df259"
                        }
                      />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                </PieChart>
              </ChartContainer>
            </div>

          
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <span className="material-icons text-sm text-primary">show_chart</span> Workout Lengths
                </h3>
              </div>
              <ChartContainer
                className="h-64 w-full"
                config={{ duration: { label: "Duration", color: "#0df259" } }}
              >
                <LineChart data={durationTrendData}>
                  <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="var(--color-duration)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-duration)" }}
                  />
                </LineChart>
              </ChartContainer>
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
