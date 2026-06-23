const WEB_PUSH_SERVICE_WORKER_PATH = "/web-push-sw.js";

function urlBase64ToUint8Array(value) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const normalizedValue = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
  const rawValue = globalThis.atob(normalizedValue);
  const outputArray = new Uint8Array(rawValue.length);

  for (let index = 0; index < rawValue.length; index += 1) {
    outputArray[index] = rawValue.codePointAt(index) ?? 0;
  }

  return outputArray;
}

export function isWebPushSupported() {
  return (
    globalThis.window !== undefined &&
    "Notification" in globalThis &&
    "serviceWorker" in navigator &&
    "PushManager" in globalThis
  );
}

export function isWebPushConfigured() {
  return Boolean((process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || "").trim());
}

export function getBrowserNotificationPermission() {
  if (globalThis.window === undefined || !("Notification" in globalThis)) return "unsupported";
  return Notification.permission;
}

export async function registerWebPushServiceWorker() {
  if (!isWebPushSupported()) {
    throw new Error("This browser does not support web push notifications.");
  }

  return navigator.serviceWorker.register(WEB_PUSH_SERVICE_WORKER_PATH, { scope: "/" });
}

export async function getExistingWebPushSubscription() {
  if (!isWebPushSupported()) return null;

  const registration = await registerWebPushServiceWorker();
  return registration.pushManager.getSubscription();
}

export async function requestNotificationPermission() {
  if (!isWebPushSupported()) {
    throw new Error("This browser does not support web push notifications.");
  }

  return Notification.requestPermission();
}

export async function subscribeToWebPush() {
  if (!isWebPushSupported()) {
    throw new Error("This browser does not support web push notifications.");
  }

  const publicKey = (process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || "").trim();
  if (!publicKey) {
    throw new Error("Push notifications are not configured for this deployment.");
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Notifications are blocked in your browser settings."
        : "Notification permission was not granted."
    );
  }

  const registration = await registerWebPushServiceWorker();
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) return existingSubscription;

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });
}

export async function unsubscribeFromWebPush() {
  const subscription = await getExistingWebPushSubscription();
  if (!subscription) return false;

  return subscription.unsubscribe();
}
