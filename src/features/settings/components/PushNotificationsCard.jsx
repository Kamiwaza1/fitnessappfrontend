"use client";

import { useEffect, useState } from "react";
import { deleteWebPushSubscription, saveWebPushSubscription } from "@/features/notifications/api/webPushApi";
import {
  getBrowserNotificationPermission,
  getExistingWebPushSubscription,
  isWebPushConfigured,
  isWebPushSupported,
  subscribeToWebPush,
  unsubscribeFromWebPush,
} from "@/features/notifications/utils/webPushClient";
import StatusMessage from "@/shared/components/StatusMessage";

function formatNotificationPermission(permission) {
  switch (permission) {
    case "granted":
      return "Enabled";
    case "denied":
      return "Blocked";
    case "default":
      return "Not enabled";
    default:
      return "Unsupported";
  }
}

export default function PushNotificationsCard() {
  const [notificationPermission, setNotificationPermission] = useState("unsupported");
  const [pushSubscription, setPushSubscription] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationError, setNotificationError] = useState("");
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPushState() {
      const nextPushSupported = isWebPushSupported();
      if (!isMounted) return;

      setPushSupported(nextPushSupported);

      if (!nextPushSupported) {
        if (isMounted) {
          setNotificationPermission(getBrowserNotificationPermission());
          setPushSubscription(null);
        }
        return;
      }

      try {
        const subscription = await getExistingWebPushSubscription();
        if (!isMounted) return;

        setNotificationPermission(getBrowserNotificationPermission());
        setPushSubscription(subscription?.toJSON() || null);
      } catch {
        if (!isMounted) return;
        setNotificationPermission(getBrowserNotificationPermission());
        setPushSubscription(null);
      }
    }

    loadPushState();

    return () => {
      isMounted = false;
    };
  }, []);

  const enableButtonLabel = (() => {
    if (isUpdatingNotifications) return "Updating...";
    if (pushSubscription) return "Notifications enabled";
    if (!isWebPushConfigured()) return "Notifications unavailable";
    return "Enable push notifications";
  })();

  const enablePushNotifications = async () => {
    setNotificationMessage("");
    setNotificationError("");
    setIsUpdatingNotifications(true);

    try {
      const subscription = await subscribeToWebPush();
      const subscriptionJson = subscription.toJSON();

      await saveWebPushSubscription({
        subscription: subscriptionJson,
        topics: ["live-workout-messages"],
      });

      setNotificationPermission(getBrowserNotificationPermission());
      setPushSubscription(subscriptionJson);
      setNotificationMessage("Push notifications enabled for live workout messages.");
    } catch (error) {
      try {
        await unsubscribeFromWebPush();
      } catch {
        // Ignore cleanup failures after a failed subscription save.
      }

      setNotificationPermission(getBrowserNotificationPermission());
      setPushSubscription(null);
      setNotificationError(error?.message || "Could not enable push notifications.");
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  const disablePushNotifications = async () => {
    setNotificationMessage("");
    setNotificationError("");
    setIsUpdatingNotifications(true);

    let serverCleanupFailed = false;

    try {
      if (pushSubscription?.endpoint) {
        await deleteWebPushSubscription(pushSubscription.endpoint);
      }
    } catch {
      serverCleanupFailed = true;
    }

    try {
      await unsubscribeFromWebPush();
      setPushSubscription(null);
      setNotificationPermission(getBrowserNotificationPermission());
      setNotificationMessage(
        serverCleanupFailed
          ? "Notifications disabled in this browser. Server cleanup will be retried when you subscribe again."
          : "Push notifications disabled."
      );
    } catch (error) {
      setNotificationError(error?.message || "Could not disable push notifications.");
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500 dark:bg-background-dark dark:text-slate-400">
        Browser permission: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatNotificationPermission(notificationPermission)}</span>
      </div>

      <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500 dark:bg-background-dark dark:text-slate-400">
        Subscription status: <span className="font-semibold text-slate-700 dark:text-slate-200">{pushSubscription ? "Registered" : "Not registered"}</span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-500 dark:border-white/10 dark:bg-background-dark dark:text-slate-400">
        {isWebPushConfigured()
          ? "This uses web push for new live workout messages. Your server must also store and send push subscriptions for delivery to work."
          : "Push notifications are disabled because this deployment does not define a web push public key."}
      </div>

      {notificationError ? <StatusMessage tone="error" className="text-left">{notificationError}</StatusMessage> : null}
      {notificationMessage ? <StatusMessage className="text-left text-primary">{notificationMessage}</StatusMessage> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={enablePushNotifications}
          disabled={isUpdatingNotifications || pushSubscription !== null || !pushSupported || !isWebPushConfigured()}
          className="flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background transition-opacity hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enableButtonLabel}
        </button>
        <button
          type="button"
          onClick={disablePushNotifications}
          disabled={isUpdatingNotifications || pushSubscription === null}
          className="flex flex-1 items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Disable notifications
        </button>
      </div>
    </div>
  );
}
