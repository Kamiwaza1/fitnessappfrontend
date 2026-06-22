self.addEventListener("push", (event) => {
  const payload = (() => {
    if (!event.data) return {};

    try {
      return event.data.json();
    } catch {
      const text = event.data.text();
      return text ? { body: text } : {};
    }
  })();

  const title = payload.title || "New live workout message";
  const body = payload.body || "Open the app to read the latest message.";
  const options = {
    body,
    data: {
      url: payload.url || "/workouts",
    },
    icon: payload.icon || "/next.svg",
    badge: payload.badge || "/next.svg",
    tag: payload.tag || "live-workout-message",
    renotify: true,
  };

  event.waitUntil(globalThis.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const destinationUrl = event.notification.data?.url || "/workouts";

  event.waitUntil(
    globalThis.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const matchingClient = clients.find((client) => {
        try {
          return new URL(client.url).pathname === new URL(destinationUrl, globalThis.location.origin).pathname;
        } catch {
          return false;
        }
      });

      if (matchingClient) {
        return matchingClient.focus();
      }

      return globalThis.clients.openWindow(destinationUrl);
    })
  );
});