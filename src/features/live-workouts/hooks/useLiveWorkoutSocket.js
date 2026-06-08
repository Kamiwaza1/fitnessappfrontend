"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getLiveWorkoutAuthHeader } from "@/features/live-workouts/api/liveWorkoutsApi";
import { buildLiveWorkoutSocketUrl } from "@/features/live-workouts/utils/liveWorkoutSocketUrl";

export function useLiveWorkoutSocket({ roomCode, enabled = true, onEvent }) {
  const clientRef = useRef(null);
  const [connectionState, setConnectionState] = useState("DISCONNECTED");
  const authHeader = getLiveWorkoutAuthHeader();
  const isUnauthorized = enabled && Boolean(roomCode) && !authHeader;

  useEffect(() => {
    if (!enabled || !roomCode) return undefined;

    if (!authHeader) {
      return undefined;
    }

    const normalizedRoomCode = roomCode.toUpperCase();
    const client = new Client({
      webSocketFactory: () => new SockJS(buildLiveWorkoutSocketUrl()),
      connectHeaders: {
        Authorization: authHeader,
      },
      reconnectDelay: 3000,
      onConnect: () => {
        setConnectionState("CONNECTED");
        client.subscribe(`/topic/live-workouts/${normalizedRoomCode}`, (message) => {
          if (!message.body) return;
          try {
            onEvent?.(JSON.parse(message.body));
          } catch {
            // Ignore malformed socket messages.
          }
        });
        client.publish({
          destination: `/app/live-workouts/${normalizedRoomCode}/join`,
          body: "{}",
        });
      },
      onWebSocketClose: () => setConnectionState("DISCONNECTED"),
      onStompError: () => setConnectionState("ERROR"),
      onWebSocketError: () => setConnectionState("ERROR"),
    });

    const connectingTimeout = window.setTimeout(() => setConnectionState("CONNECTING"), 0);
    clientRef.current = client;
    client.activate();

    return () => {
      window.clearTimeout(connectingTimeout);
      if (client.connected) {
        client.publish({
          destination: `/app/live-workouts/${normalizedRoomCode}/leave`,
          body: "{}",
        });
      }
      client.deactivate();
      clientRef.current = null;
    };
  }, [authHeader, enabled, onEvent, roomCode]);

  const sendProgress = useCallback(
    (progress) => {
      const client = clientRef.current;
      if (!client?.connected || !roomCode) return false;
      client.publish({
        destination: `/app/live-workouts/${roomCode.toUpperCase()}/progress`,
        body: JSON.stringify(progress),
      });
      return true;
    },
    [roomCode]
  );

  const sendMessage = useCallback(
    (text) => {
      const client = clientRef.current;
      if (!client?.connected || !roomCode) return false;
      client.publish({
        destination: `/app/live-workouts/${roomCode.toUpperCase()}/messages`,
        body: JSON.stringify({ text }),
      });
      return true;
    },
    [roomCode]
  );

  const leaveRoom = useCallback(() => {
    const client = clientRef.current;
    if (!client?.connected || !roomCode) return false;
    client.publish({
      destination: `/app/live-workouts/${roomCode.toUpperCase()}/leave`,
      body: "{}",
    });
    return true;
  }, [roomCode]);

  return {
    connectionState: isUnauthorized ? "UNAUTHORIZED" : connectionState,
    sendProgress,
    sendMessage,
    leaveRoom,
  };
}
