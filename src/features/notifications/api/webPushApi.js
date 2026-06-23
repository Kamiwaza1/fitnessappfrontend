import { buildApiUrl } from "@/shared/api/apiBase";
import { fetchAuthenticatedJson } from "@/shared/api/http";

const WEB_PUSH_SUBSCRIPTIONS_PATH =
  (process.env.NEXT_PUBLIC_WEB_PUSH_SUBSCRIPTIONS_PATH || "/api/v1/notifications/push-subscriptions").trim() ||
  "/api/v1/notifications/push-subscriptions";

const WEB_PUSH_SUBSCRIPTIONS_ENDPOINT = buildApiUrl(WEB_PUSH_SUBSCRIPTIONS_PATH);

export async function saveWebPushSubscription({ subscription, topics = [] }) {
  try {
    return await fetchAuthenticatedJson(WEB_PUSH_SUBSCRIPTIONS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription, topics }),
    });
  } catch (error) {
    throw new Error(error?.data?.message || error?.message || "Could not save push subscription.");
  }
}

export async function deleteWebPushSubscription(endpoint) {
  try {
    return await fetchAuthenticatedJson(WEB_PUSH_SUBSCRIPTIONS_ENDPOINT, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });
  } catch (error) {
    throw new Error(error?.data?.message || error?.message || "Could not remove push subscription.");
  }
}