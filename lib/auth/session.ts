export const AUTH_TOKEN_COOKIE = "lms_auth_token";
export const AUTH_RESPONSE_STORAGE_KEY = "auth";
export const AUTH_TOKEN_STORAGE_KEY = "token";

export type AuthSession = {
  access_token: string;
  token_type: string;
};

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function persistAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    throw new Error("Không thể lưu phiên đăng nhập ngoài trình duyệt.");
  }

  if (!session.access_token) {
    throw new Error("API đăng nhập không trả về access token.");
  }

  window.localStorage.setItem(AUTH_RESPONSE_STORAGE_KEY, JSON.stringify(session));
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.access_token);

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(session.access_token)}; Path=/; SameSite=Lax${secure}`;
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_RESPONSE_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
