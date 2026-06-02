"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppPageShell from "@/shared/components/AppPageShell";
import StatusMessage from "@/shared/components/StatusMessage";
import { useAuth } from "@/context/AuthContext";
import {
  closeLiveWorkoutRoom,
  fetchLiveWorkoutRoom,
} from "@/features/live-workouts/api/liveWorkoutsApi";
import { useLiveWorkoutSocket } from "@/features/live-workouts/hooks/useLiveWorkoutSocket";

function getParticipantLabel(participant) {
  return participant?.displayName || participant?.email || "User";
}

export default function LiveWorkoutRoomPage({ roomCode }) {
  const router = useRouter();
  const { user } = useAuth();
  const normalizedRoomCode = String(roomCode || "").toUpperCase();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState({
    currentExerciseIndex: 0,
    completedSets: 0,
    status: "ACTIVE",
  });

  const handleSocketEvent = useCallback((event) => {
    if (event?.room) {
      setRoom(event.room);
    }
    if (event?.type === "ROOM_CLOSED") {
      setError("This live workout room has ended.");
    }
  }, []);

  const { connectionState, sendProgress, leaveRoom } = useLiveWorkoutSocket({
    roomCode: normalizedRoomCode,
    enabled: Boolean(room && !error),
    onEvent: handleSocketEvent,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadRoom() {
      setIsLoading(true);
      setError("");
      try {
        const nextRoom = await fetchLiveWorkoutRoom(normalizedRoomCode);
        if (isMounted) setRoom(nextRoom);
      } catch (loadError) {
        if (isMounted) setError(loadError?.message || "Could not load live workout room.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (normalizedRoomCode) {
      loadRoom();
    }

    return () => {
      isMounted = false;
    };
  }, [normalizedRoomCode]);

  const participants = room?.participants || [];
  const currentUserEmail = user?.email || user?.username;
  const isHost = Boolean(room?.hostEmail && currentUserEmail && room.hostEmail === currentUserEmail);

  const connectionLabel = useMemo(() => {
    switch (connectionState) {
      case "CONNECTED":
        return "Live";
      case "CONNECTING":
        return "Connecting";
      case "UNAUTHORIZED":
        return "Login required";
      case "ERROR":
        return "Connection issue";
      default:
        return "Offline";
    }
  }, [connectionState]);

  const updateProgress = (patch) => {
    const nextProgress = { ...progress, ...patch };
    setProgress(nextProgress);
    sendProgress(nextProgress);
  };

  const handleLeave = () => {
    leaveRoom();
    router.push("/workouts");
  };

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await closeLiveWorkoutRoom(normalizedRoomCode);
      router.push("/workouts");
    } catch (closeError) {
      setError(closeError?.message || "Could not close live workout room.");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <AppPageShell mainClassName="min-h-dvh">
      <section className="mx-auto flex max-w-5xl flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-background-dark/40 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Live Workout</p>
            <h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
              {room?.workoutName || "Live Room"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Room code <span className="font-bold text-primary">{normalizedRoomCode}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary">
              {connectionLabel}
            </span>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={handleLeave}
            >
              Leave
            </button>
            {isHost ? (
              <button
                type="button"
                className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-60"
                onClick={handleClose}
                disabled={isClosing}
              >
                End Room
              </button>
            ) : null}
          </div>
        </header>

        {isLoading ? <StatusMessage>Loading live room...</StatusMessage> : null}
        {!isLoading && error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

        {!isLoading && room ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-background-dark/40">
              <h2 className="text-lg font-bold">Your Progress</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Exercise
                  <input
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
                    value={progress.currentExerciseIndex}
                    onChange={(event) => updateProgress({ currentExerciseIndex: Number(event.target.value) })}
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Completed Sets
                  <input
                    type="number"
                    min="0"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
                    value={progress.completedSets}
                    onChange={(event) => updateProgress({ completedSets: Number(event.target.value) })}
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-background-light px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70"
                    value={progress.status}
                    onChange={(event) => updateProgress({ status: event.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="RESTING">Resting</option>
                    <option value="DONE">Done</option>
                  </select>
                </label>
              </div>
            </section>

            <aside className="rounded-xl border border-primary/10 bg-background-light p-4 dark:bg-background-dark/40">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Participants</h2>
                <span className="text-xs uppercase tracking-widest text-slate-400">{participants.length} online</span>
              </div>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.email} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-bold">{getParticipantLabel(participant)}</p>
                      <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        {participant.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Exercise {participant.currentExerciseIndex ?? 0} · {participant.completedSets ?? 0} sets
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </section>
    </AppPageShell>
  );
}
