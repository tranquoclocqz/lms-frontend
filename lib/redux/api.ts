import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

type ApiEnvelope<T> = {
  status: 0 | 1 | 401;
  data: T | null;
  message: string;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  },
});

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== "/sign-in") {
    window.location.assign("/sign-in");
  }
}

const baseQueryWithResponseHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    if (status === 401) {
      redirectToLogin();
      return {
        error: {
          status: 401,
          data: { message: "Unauthorized" },
        } as FetchBaseQueryError,
      };
    }

    return result;
  }

  const payload = result.data as ApiEnvelope<unknown> | unknown | undefined;

  if (payload && typeof payload === "object" && "status" in payload) {
    const envelope = payload as ApiEnvelope<unknown>;

    if (envelope.status === 1) {
      return {
        data: envelope.data ?? null,
      };
    }

    if (envelope.status === 401) {
      redirectToLogin();
      return {
        error: {
          status: 401,
          data: envelope,
        } as FetchBaseQueryError,
      };
    }

    return {
      error: {
        status: envelope.status,
        data: envelope,
      } as FetchBaseQueryError,
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
