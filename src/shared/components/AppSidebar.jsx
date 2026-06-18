"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import {
  ACTIVE_LIVE_WORKOUT_ROOM_CHANGED,
  getActiveLiveWorkoutRoom,
} from "@/features/live-workouts/utils/activeLiveWorkoutRoom";

const NAV_ITEMS = [
  { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { name: "Workouts", icon: "fitness_center", path: "/workouts" },
  { name: "Exercise Library", icon: "menu_book", path: "/library" },
  { name: "Live Workout", icon: "sensors", path: "/live-workouts", matchPrefix: "/live-workouts" },
  { name: "History", icon: "history", path: "/workout-histories" },
  { name: "Nutrition", icon: "restaurant", path: "/nutrition" },
  { name: "Progress", icon: "insights", path: "/progress" },
  { name: "Settings", icon: "settings", path: "/settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeRoom, setActiveRoom] = useState(null);
  const initials = String(user?.fullName || user?.email || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const activeRoomHref = activeRoom?.roomCode ? `/live-workouts/${activeRoom.roomCode}` : "";
  const isActiveRoomPage = useMemo(() => pathname === activeRoomHref, [activeRoomHref, pathname]);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => {
      setActiveRoom(getActiveLiveWorkoutRoom());
    }, 0);

    const handleActiveRoomChanged = (event) => {
      setActiveRoom(event.detail ?? getActiveLiveWorkoutRoom());
    };

    const handleStorage = () => {
      setActiveRoom(getActiveLiveWorkoutRoom());
    };

    window.addEventListener(ACTIVE_LIVE_WORKOUT_ROOM_CHANGED, handleActiveRoomChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearTimeout(initialLoadId);
      window.removeEventListener(ACTIVE_LIVE_WORKOUT_ROOM_CHANGED, handleActiveRoomChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-primary/10 bg-background-light dark:bg-background-dark/50 lg:flex">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-tighter text-primary italic">DARK LIFT</h1>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {activeRoom?.roomCode ? (
            <Link
              href={activeRoomHref}
              className={clsx(
                "mb-4 flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                isActiveRoomPage
                  ? "border-primary bg-primary text-background"
                  : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <span className="material-symbols-outlined text-[22px]">sensors</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{activeRoom.workoutName || "Live Workout"}</span>
                <span className="block text-xs font-semibold opacity-75">Room {activeRoom.roomCode}</span>
              </span>
            </Link>
          ) : null}

          {NAV_ITEMS.map((item) => {
            const isActive = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={clsx(
                  "flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors",
                  isActive
                    ? "border border-primary/20 bg-primary/10 text-primary"
                    : "text-slate-400 hover:bg-primary/5 hover:text-primary",
                )}
              >
                <span className="material-icons">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="material-icons">logout</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        <div className="border-t border-primary/10 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-sm font-black text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <p suppressHydrationWarning className="truncate text-sm font-bold">
                {user?.fullName}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {activeRoom?.roomCode && !isActiveRoomPage ? (
        <Link
          href={activeRoomHref}
          className="fixed inset-x-3 bottom-[78px] z-50 mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary px-3 py-2 text-xs font-bold text-background shadow-xl shadow-slate-950/20 lg:hidden"
        >
          <span className="material-symbols-outlined text-[18px]">sensors</span>
          <span className="truncate">{activeRoom.workoutName || "Live Workout"}</span>
          <span className="shrink-0 opacity-80">{activeRoom.roomCode}</span>
        </Link>
      ) : null}

      <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md gap-1 overflow-x-auto rounded-xl border border-primary/15 bg-background-light/95 p-1 shadow-2xl shadow-slate-950/20 backdrop-blur dark:bg-background-dark/95 lg:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={clsx(
                "flex min-w-[72px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-semibold transition-colors",
                isActive ? "bg-primary text-background" : "text-slate-500 dark:text-slate-400"
              )}
            >
              <span className="material-icons text-[20px] leading-none">{item.icon}</span>
              <span className="max-w-full truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
