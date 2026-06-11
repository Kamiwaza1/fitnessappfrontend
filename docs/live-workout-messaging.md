# Live workout messaging fix

## Problem

Live workout chat had asymmetric behavior:

- One participant could send and receive messages.
- Another participant could receive socket events, but could not send messages from the UI.

The frontend was using `isCurrentUserParticipant` as the gate for loading message history and enabling the Send button. That value depends on `room.participants` containing the current user's email. In practice, a user can already be connected to the STOMP room topic and receive chat broadcasts before the room payload has been updated with that user as a participant.

That created a split state: subscribed users could receive messages, but the UI treated them as not joined yet and disabled sending.

## Fix

The chat send permission now follows the actual chat transport state:

- The room must be loaded.
- The STOMP connection must be `CONNECTED`.

Participant membership is still used for display and participant list behavior, but it no longer blocks chat send or message-history loading.

Changed file:

- `src/features/live-workouts/pages/LiveWorkoutRoomPage.jsx`

Key behavior changes:

- Message history loads once a room is loaded, instead of waiting for `isCurrentUserParticipant`.
- The Send button is enabled when `room` exists and `connectionState === "CONNECTED"`.
- Submit-time validation checks room load and socket connection directly.
- Host and "my message" comparisons use case-insensitive email matching.

## Why this is safer

The backend remains the source of truth for authorization. If a user should not send to a room, the socket endpoint can reject or ignore the message. The frontend no longer blocks a valid connected participant just because the participant list is stale or shaped differently than expected.

## Verification

Run:

```bash
npm run lint
npm run build
```

Manual check:

1. Log in with two different users or browser sessions.
2. Start or join the same live workout room from both sessions.
3. Confirm both sessions can receive messages.
4. Confirm both sessions can type and send messages after the room shows `Live`.
5. Confirm each user's own messages are highlighted correctly.
