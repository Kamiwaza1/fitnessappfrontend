"use client";

import { useMemo } from "react";
import AppPageShell from "@/shared/components/AppPageShell";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

const MUSCLE_TYPE_CONFIG = {
  CHEST: { label: "Chest", color: "#ef4444" },
  BACK: { label: "Back", color: "#3b82f6" },
  SHOULDERS: { label: "Shoulders", color: "#f59e0b" },
  BICEPS: { label: "Biceps", color: "#a855f7" },
  TRICEPS: { label: "Triceps", color: "#ec4899" },
  LEGS: { label: "Legs", color: "#22c55e" },
  GLUTES: { label: "Glutes", color: "#14b8a6" },
  CORE: { label: "Core", color: "#06b6d4" },
  CALVES: { label: "Calves", color: "#84cc16" },
  FULL_BODY: { label: "Full Body", color: "#6366f1" },
};

function getExerciseVolume(exercise) {
  const sets = Number(exercise?.sets || 0);
  const reps = Number(exercise?.reps || 0);
  const weight = Number(exercise?.weightKg || 0);

  if (sets > 0 && reps > 0 && weight > 0) {
    return sets * reps * weight;
  }

  return sets;
}

export default function ProgressPage() {
  const { workouts } = useWorkoutList();
  const totalVolume = useMemo(
    () =>
      workouts.reduce((sum, workout) => {
        if (Array.isArray(workout?.exercises) && workout.exercises.length > 0) {
          return (
            sum +
            workout.exercises.reduce((exerciseSum, exercise) => {
              return exerciseSum + getExerciseVolume(exercise);
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

  const muscleVolumeData = useMemo(() => {
    const grouped = workouts.reduce((acc, workout) => {
      const exercises = Array.isArray(workout?.exercises) && workout.exercises.length > 0
        ? workout.exercises
        : [{ muscleType: workout?.muscleType, sets: workout?.sets, reps: workout?.reps, weightKg: workout?.weightKg }];

      exercises.forEach((exercise) => {
        const muscleType = exercise?.muscleType || "FULL_BODY";
        acc[muscleType] = (acc[muscleType] || 0) + getExerciseVolume(exercise);
      });

      return acc;
    }, {});

    return Object.entries(grouped)
      .filter(([, volume]) => volume > 0)
      .map(([muscleType, volume]) => ({
        muscleType,
        volume,
        fill: MUSCLE_TYPE_CONFIG[muscleType]?.color || "#64748b",
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

          </div>
          
        </header>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <div className="min-h-[440px] rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="material-icons text-sm text-primary">analytics</span> Volume Per
                Muscle Group
              </h3>
              <ChartContainer
                className="mx-auto h-[360px] w-full max-w-[520px] aspect-auto"
                config={{
                  volume: { label: "Volume" },
                  ...MUSCLE_TYPE_CONFIG,
                }}
              >
                <PieChart margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
                  <ChartTooltip content={<ChartTooltipContent nameKey="muscleType" />} />
                  <Pie data={muscleVolumeData} dataKey="volume" nameKey="muscleType" outerRadius={110}>
                    {muscleVolumeData.map((entry) => (
                      <Cell key={entry.muscleType} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="muscleType" />} />
                </PieChart>
              </ChartContainer>
            </div>

          
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
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

            {/* Recent Personal Records removed */}
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
