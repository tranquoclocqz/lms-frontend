import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  clearAuthSession,
  getStoredAccessToken,
} from "@/lib/auth/session";

type ApiEnvelope<T> = {
  status: number;
  data: T | null;
  message: string;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getStoredAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/login?next=${encodeURIComponent(next)}`);
  }
}

const baseQueryWithResponseHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401) {
      clearAuthSession();
      redirectToLogin();
      return {
        error: {
          status: 401,
          data: { message: "Unauthorized" },
        },
      };
    }

    return result;
  }

  const payload = result.data;

  if (payload && typeof payload === "object" && "status" in payload) {
    const envelope = payload as ApiEnvelope<unknown>;

    if (envelope.status === 1) {
      return {
        data: envelope.data ?? null,
      };
    }

    if (envelope.status === 401) {
      clearAuthSession();
      redirectToLogin();
      return {
        error: {
          status: 401,
          data: envelope,
        },
      };
    }

    return {
      error: {
        status: envelope.status,
        data: envelope,
      },
    };
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithResponseHandling,
  endpoints: () => ({}),
});

export const { reducerPath, reducer, middleware } = api;
