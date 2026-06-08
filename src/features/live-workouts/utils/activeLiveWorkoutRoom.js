"use client";

const STORAGE_KEY = "fitnessapp.activeLiveWorkoutRoom";

export const ACTIVE_LIVE_WORKOUT_ROOM_CHANGED = "fitnessapp:active-live-workout-room-changed";

function emitActiveRoomChanged(room) {
  window.dispatchEvent(new CustomEvent(ACTIVE_LIVE_WORKOUT_ROOM_CHANGED, { detail: room }));
}

export function getActiveLiveWorkoutRoom() {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function setActiveLiveWorkoutRoom(room) {
  if (typeof window === "undefined" || !room?.roomCode) return;

  const activeRoom = {
    roomCode: String(room.roomCode).toUpperCase(),
    workoutName: room.workoutName || "Live Workout",
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activeRoom));
  emitActiveRoomChanged(activeRoom);
}

export function clearActiveLiveWorkoutRoom(roomCode = null) {
  if (typeof window === "undefined") return;

  const currentRoom = getActiveLiveWorkoutRoom();
  if (roomCode && currentRoom?.roomCode !== String(roomCode).toUpperCase()) return;

  window.localStorage.removeItem(STORAGE_KEY);
  emitActiveRoomChanged(null);
}
