function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
}

export function buildLiveWorkoutSocketUrl() {
  if (typeof window === "undefined") return "";

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const isNextDevServer = window.location.port === "3000" || window.location.port === "3001";
    const host = isNextDevServer ? `${window.location.hostname}:8080` : window.location.host;
    return `${protocol}//${host}/ws`;
  }

  const url = new URL(apiBaseUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws";
  url.search = "";
  return url.toString();
}
