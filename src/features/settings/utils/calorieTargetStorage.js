import { useSyncExternalStore } from "react";

const CALORIE_TARGET_KEY = "fitness.calorieTarget";
export const CALORIE_TARGET_EVENT = "fitness:calorie-target-updated";

export function readCalorieTarget() {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(CALORIE_TARGET_KEY);
  const value = Number(rawValue);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function saveCalorieTarget(value) {
  if (typeof window === "undefined") return null;

  const numericValue = Number(value);
  const nextValue = Number.isFinite(numericValue) && numericValue > 0 ? Math.round(numericValue) : null;

  if (nextValue) {
    window.localStorage.setItem(CALORIE_TARGET_KEY, String(nextValue));
  } else {
    window.localStorage.removeItem(CALORIE_TARGET_KEY);
  }

  window.dispatchEvent(new CustomEvent(CALORIE_TARGET_EVENT, { detail: nextValue }));
  return nextValue;
}

function subscribeToCalorieTarget(callback) {
  if (typeof window === "undefined") return () => {};

  const syncStorageCalorieTarget = (event) => {
    if (event.key === CALORIE_TARGET_KEY) callback();
  };

  window.addEventListener(CALORIE_TARGET_EVENT, callback);
  window.addEventListener("storage", syncStorageCalorieTarget);

  return () => {
    window.removeEventListener(CALORIE_TARGET_EVENT, callback);
    window.removeEventListener("storage", syncStorageCalorieTarget);
  };
}

export function useCalorieTarget() {
  return useSyncExternalStore(subscribeToCalorieTarget, readCalorieTarget, () => null);
}
