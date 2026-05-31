const normalizedApiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedApiBase ? `${normalizedApiBase}${normalizedPath}` : normalizedPath;
}

