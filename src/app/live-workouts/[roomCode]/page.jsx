import LiveWorkoutRoomPage from "@/features/live-workouts/pages/LiveWorkoutRoomPage";

export default function Page({ params }) {
  return <LiveWorkoutRoomPage roomCode={params.roomCode} />;
}
