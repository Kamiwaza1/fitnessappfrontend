"use client";

import AppPageShell from "@/shared/components/AppPageShell";
import { formatLongDate, toIsoLocalDate } from "@/shared/utils/date";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const { workouts, isLoading, error } = useWorkoutList();
  const todayWorkout = workouts.find((workout) => workout.workoutDate === toIsoLocalDate());
  const displayName = user?.fullName;

  const goalTitle = isLoading ? "SYNCING..." : todayWorkout ? "WORKOUT DAY" : "REST DAY";
  const goalSubtitle = isLoading
    ? "Checking your workout schedule..."
    : error
      ? error
      : todayWorkout
        ? `Today: ${todayWorkout.name}`
        : "No active workout scheduled.";

  return (
    <AppPageShell mainClassName="h-screen overflow-hidden">
      <header className="flex items-center justify-between p-5">
        <div>
          <h2 className="text-3xl font-bold">
            Welcome back, <span className="text-primary">{displayName}</span>
          </h2>
          <p className="mt-1 text-slate-400">Ready to crush your session today?</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden text-right sm:block">
            <p suppressHydrationWarning className="text-xs uppercase tracking-widest text-slate-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <p suppressHydrationWarning className="font-bold">{formatLongDate(new Date())}</p>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-background-light text-primary transition-colors hover:bg-primary/10 dark:bg-background-dark/80">
            <span className="material-icons">notifications</span>
          </button>
        </div>
      </header>

      <div className="space-y-4 px-5 pb-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5 md:grid-cols-2 lg:col-span-2">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    className="text-primary/10"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="7"
                  />
                  <circle
                    className="text-primary"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeDasharray="352"
                    strokeDashoffset="352"
                    strokeWidth="7"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold italic">0</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">
                    / 2,400 Kcal
                  </span>
                </div>
              </div>
              <p className="text-center font-bold">Daily Calories</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    className="text-primary/10"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="7"
                  />
                  <circle
                    className="text-primary"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="56"
                    stroke="currentColor"
                    strokeDasharray="352"
                    strokeDashoffset="352"
                    strokeWidth="7"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold italic">0g</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">
                    / 180g Protein
                  </span>
                </div>
              </div>
              <p className="text-center font-bold">Daily Protein</p>
            </div>
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
            <div className="pointer-events-none absolute -right-4 -top-4 rotate-12 transform text-primary/10">
              <span className="material-icons text-9xl">fitness_center</span>
            </div>
            <div>
              <span className="rounded bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                Today&apos;s Goal
              </span>
              <h3 className="mt-3 text-2xl font-extrabold italic">{goalTitle}</h3>
              <p className="mt-2 text-slate-400">{goalSubtitle}</p>
              <div className="mt-4 flex items-center space-x-4 text-sm font-medium">
                {todayWorkout ? (
                  <>
                    <span className="inline-flex items-center space-x-1 text-primary">
                      <span className="material-icons text-base">schedule</span>
                      <span>
                        {todayWorkout.durationMinutes
                          ? `${todayWorkout.durationMinutes} min`
                          : "Duration TBD"}
                      </span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-slate-300">
                      <span className="material-icons text-base">event</span>
                      <span>{workouts.length} scheduled</span>
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500">
                    {isLoading ? "Syncing workouts..." : `${workouts.length} scheduled`}
                  </span>
                )}
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-primary py-2.5 font-bold text-background transition-all hover:bg-primary/90">
              <span>{todayWorkout ? "START WORKOUT" : "PLAN WORKOUT"}</span>
              <span className="material-icons">play_arrow</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Weekly Training Volume
              </h3>
              <span className="material-icons cursor-pointer text-primary">bar_chart</span>
            </div>
            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
              No data available
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Body Weight Trend (kg)
              </h3>
              <div className="flex space-x-4">
                <span className="text-xs font-bold text-primary">Avg: --</span>
              </div>
            </div>
            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
              No data available
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-primary/10 bg-background-light dark:bg-white/5">
          <div className="flex items-center justify-between border-b border-primary/10 p-3.5">
            <h3 className="text-sm font-bold uppercase tracking-widest">Recent Activity Log</h3>
            <button className="text-xs font-bold text-primary hover:underline">VIEW ALL</button>
          </div>
          <div className="p-4 text-center text-sm text-slate-500">No recent activity found.</div>
        </div>
      </div>
    </AppPageShell>
  );
}
