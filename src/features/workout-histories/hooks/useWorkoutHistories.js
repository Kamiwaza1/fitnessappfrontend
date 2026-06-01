import { useEffect, useState } from "react";
import { fetchWorkoutHistories } from "@/features/workout-histories/api/workoutHistoriesApi";

export function useWorkoutHistories() {
  const [workoutHistories, setWorkoutHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadWorkoutHistories = async () => {
      setIsLoading(true);
      setError("");

      try {
        const histories = await fetchWorkoutHistories();
        if (!isMounted) return;
        setWorkoutHistories(histories);
      } catch (loadError) {
        if (!isMounted) return;
        setWorkoutHistories([]);
        setError(loadError?.message || "Could not load workout histories right now.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWorkoutHistories();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    workoutHistories,
    isLoading,
    error,
  };
}
