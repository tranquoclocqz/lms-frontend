const DEFAULT_API_BASE_URL = "https://api.loclaptrinh.com";

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    DEFAULT_API_BASE_URL
  );
}

export function buildRemoteApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl().replace(/\/$/, "");

  if (normalizedPath.startsWith("/api")) {
    return `${baseUrl}${normalizedPath}`;
  }

  return `${baseUrl}/api${normalizedPath}`;
}

export async function fetchRemoteApi<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(buildRemoteApiUrl(path), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || "Yêu cầu tới API thất bại";
    throw new Error(message);
  }

  return payload as T;
}
