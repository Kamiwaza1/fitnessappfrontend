import LiveWorkoutRoomPage from "@/features/live-workouts/pages/LiveWorkoutRoomPage";

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <LiveWorkoutRoomPage roomCode={resolvedParams.roomCode} />;
}
