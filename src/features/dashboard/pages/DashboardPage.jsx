"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import AppPageShell from "@/shared/components/AppPageShell";
import { toIsoLocalDate } from "@/shared/utils/date";
import { useWorkoutList } from "@/features/workouts/hooks/useWorkoutList";
import { useActiveWorkoutSession } from "@/features/workouts/hooks/useActiveWorkoutSession";
import { fetchNutritionEntries } from "@/features/nutrition/api/nutritionApi";
import { fetchCurrentUser } from "@/features/settings/api/userApi";
import { saveCalorieTarget, useCalorieTarget } from "@/features/settings/utils/calorieTargetStorage";
import {
  fetchRecommendations,
  ignoreRecommendation,
  startRecommendedWorkout,
} from "@/features/recommendations/api/recommendationsApi";

const DashboardCharts = dynamic(() => import("@/features/dashboard/components/DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="h-56 animate-pulse rounded-xl border border-primary/10 bg-background-light dark:bg-white/5" />
      <div className="h-56 animate-pulse rounded-xl border border-primary/10 bg-background-light dark:bg-white/5" />
    </div>
  ),
});

export default function DashboardPage() {
  const router = useRouter();
  const { workouts } = useWorkoutList();
  const workoutSession = useActiveWorkoutSession();
  const [nutritionEntries, setNutritionEntries] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationError, setRecommendationError] = useState("");
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [busyRecommendationId, setBusyRecommendationId] = useState("");
  const calorieTarget = useCalorieTarget();
  const weeklyDurationData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        minutes: 0,
      };
    });

    workouts.forEach((workout) => {
      const workoutDate = String(workout?.workoutDate || workout?.date || "").slice(0, 10);
      const target = days.find((item) => item.key === workoutDate);
      if (target) target.minutes += Number(workout?.durationMinutes || workout?.duration || 0);
    });

    return days;
  }, [workouts]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [nextEntries, currentUser] = await Promise.all([
          fetchNutritionEntries(),
          fetchCurrentUser().catch(() => null),
        ]);
        if (!isMounted) return;

        if (currentUser?.dailyCalorieTarget) {
          saveCalorieTarget(currentUser.dailyCalorieTarget);
        }
        setNutritionEntries(nextEntries);
      } catch {
        if (isMounted) setNutritionEntries([]);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      setIsLoadingRecommendations(true);
      setRecommendationError("");
      try {
        const nextRecommendations = await fetchRecommendations();
        if (isMounted) setRecommendations(nextRecommendations);
      } catch (loadError) {
        if (isMounted) {
          setRecommendations([]);
          setRecommendationError(loadError?.message || "Could not load recommendations.");
        }
      } finally {
        if (isMounted) setIsLoadingRecommendations(false);
      }
    }

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartRecommendation = async (recommendation) => {
    setBusyRecommendationId(recommendation.workoutId);
    setRecommendationError("");
    try {
      const workout = await startRecommendedWorkout(recommendation.workoutId);
      workoutSession.startWorkout(workout);
      router.push("/workouts");
    } catch (startError) {
      setRecommendationError(startError?.message || "Could not start recommendation.");
    } finally {
      setBusyRecommendationId("");
    }
  };

  const handleIgnoreRecommendation = async (recommendation) => {
    setBusyRecommendationId(recommendation.workoutId);
    setRecommendationError("");
    try {
      await ignoreRecommendation(recommendation.workoutId);
      setRecommendations((current) => current.filter((item) => item.workoutId !== recommendation.workoutId));
    } catch (ignoreError) {
      setRecommendationError(ignoreError?.message || "Could not ignore recommendation.");
    } finally {
      setBusyRecommendationId("");
    }
  };

  const todayNutritionTotals = useMemo(() => {
    const today = toIsoLocalDate();
    return nutritionEntries
      .filter((entry) => entry.mealDate === today)
      .reduce(
        (totals, entry) => ({
          calories: totals.calories + Number(entry.calories || 0),
          proteinGrams: totals.proteinGrams + Number(entry.proteinGrams || 0),
        }),
        { calories: 0, proteinGrams: 0 }
      );
  }, [nutritionEntries]);

  const weeklyNutritionData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        calories: 0,
      };
    });

    nutritionEntries.forEach((entry) => {
      const target = days.find((item) => item.key === entry.mealDate);
      if (target) target.calories += Number(entry.calories || 0);
    });

    return days;
  }, [nutritionEntries]);

  const calorieProgress = calorieTarget
    ? Math.min(100, (todayNutritionTotals.calories / calorieTarget) * 100)
    : 0;
  const calorieStrokeOffset = 352 - (calorieProgress / 100) * 352;

  return (
    <AppPageShell mainClassName="min-h-dvh">
      <div className="space-y-4 px-4 pb-6 sm:px-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5 md:grid-cols-2">
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
                    strokeDashoffset={calorieStrokeOffset}
                    strokeWidth="7"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold italic">{todayNutritionTotals.calories}</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">
                    {calorieTarget ? `/ ${calorieTarget} Kcal` : "Kcal"}
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
                  <span className="text-2xl font-extrabold italic">{todayNutritionTotals.proteinGrams}g</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">Protein</span>
                </div>
              </div>
              <p className="text-center font-bold">Daily Protein</p>
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recommended For You</h3>
              <p className="mt-1 text-sm text-slate-500">Personalized from your goals, history, and training balance.</p>
            </div>
            <span className="material-icons text-primary">auto_awesome</span>
          </div>

          {recommendationError ? (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {recommendationError}
            </p>
          ) : null}

          {isLoadingRecommendations ? (
            <p className="py-4 text-sm text-slate-400">Loading recommendations...</p>
          ) : null}

          {!isLoadingRecommendations && recommendations.length === 0 && !recommendationError ? (
            <p className="py-4 text-sm text-slate-400">No recommendations available yet.</p>
          ) : null}

          {!isLoadingRecommendations && recommendations.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((recommendation) => {
                const isBusy = busyRecommendationId === recommendation.workoutId;
                return (
                  <article
                    key={recommendation.workoutId}
                    className="flex min-h-48 flex-col justify-between rounded-lg border border-primary/10 bg-black/10 p-4 dark:bg-black/20"
                  >
                    <div>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h4 className="min-w-0 break-words text-base font-bold">{recommendation.workoutName}</h4>
                        <span className="shrink-0 rounded bg-primary/20 px-2 py-1 text-xs font-bold text-primary">
                          {recommendation.score}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-400">{recommendation.reason}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleStartRecommendation(recommendation)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="material-icons text-base">play_arrow</span>
                        <span>Start Workout</span>
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleIgnoreRecommendation(recommendation)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-bold text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="material-icons text-base">visibility_off</span>
                        <span>Ignore Recommendation</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>

        <DashboardCharts weeklyDurationData={weeklyDurationData} weeklyNutritionData={weeklyNutritionData} />
      </div>
    </AppPageShell>
  );
}
