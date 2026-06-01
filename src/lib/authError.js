export async function parseAuthErrorResponse(response, fallbackMessage) {
  let payload = {};

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  const fieldErrors = extractFieldErrors(payload);
  const message =
    payload?.message ||
    payload?.error ||
    statusFallbackMessage(response.status) ||
    fallbackMessage;

  return {
    status: response.status,
    message,
    fieldErrors,
    payload,
  };
}

function statusFallbackMessage(status) {
  if (status === 401) return "Invalid email or password.";
  if (status === 409) return "An account with this email already exists.";
  if (status === 400) return "Please check your inputs and try again.";
  return "";
}

function extractFieldErrors(payload) {
  if (payload?.fieldErrors && typeof payload.fieldErrors === "object") {
    return payload.fieldErrors;
  }

  if (Array.isArray(payload?.details)) {
    const fromDetails = {};
    for (const detail of payload.details) {
      if (typeof detail !== "string") continue;
      const [field, ...rest] = detail.split(":");
      if (!field || rest.length === 0) continue;
      const message = rest.join(":").trim();
      if (message && !fromDetails[field.trim()]) {
        fromDetails[field.trim()] = message;
      }
    }
    return fromDetails;
  }

  return {};
}
