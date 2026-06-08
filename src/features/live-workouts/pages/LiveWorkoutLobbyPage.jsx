"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppPageShell from "@/shared/components/AppPageShell";

export default function LiveWorkoutLobbyPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleJoinRoom = (event) => {
    event.preventDefault();
    const normalizedRoomCode = roomCode.trim().toUpperCase();

    if (!normalizedRoomCode) {
      setError("Enter a room code to join.");
      return;
    }

    router.push(`/live-workouts/${normalizedRoomCode}`);
  };

  return (
    <AppPageShell mainClassName="min-h-dvh">
      <section className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Live Workout</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Join a live room</h1>
          <p className="mt-2 text-sm text-primary/60">
            Enter a room code from a teammate, or start a live room from one of your planned workouts.
          </p>

          <form onSubmit={handleJoinRoom} className="mt-6 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary/60">
              Room code
              <input
                className="mt-2 min-h-11 w-full rounded-lg border border-primary/20 bg-background-dark/60 px-3 py-2 text-sm font-semibold uppercase tracking-widest text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={roomCode}
                onChange={(event) => {
                  setRoomCode(event.target.value);
                  setError("");
                }}
                maxLength={12}
              />
            </label>

            {error ? <p className="text-sm font-semibold text-red-400">{error}</p> : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-primary/90"
              >
                Join Room
              </button>
              <Link
                href="/workouts"
                className="flex min-h-11 items-center justify-center rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Start From Workout
              </Link>
            </div>
          </form>
        </div>
      </section>
    </AppPageShell>
  );
}
