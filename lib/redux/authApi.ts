import { api } from "@/lib/redux/api";
import type { AuthSession } from "@/lib/auth/session";

const AUTH_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/lmsuser`;

export type GoogleLoginPayload = {
  token: string;
  provider: "google";
  redirect: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  avatar_url?: string | null;
  avatarUrl?: string | null;
  picture?: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginWithGoogle: builder.mutation<AuthSession, GoogleLoginPayload>({
      query: (body) => ({
        url: `${AUTH_API_BASE_URL}/auth/callback`,
        method: "POST",
        body: new URLSearchParams({
          provider: body.provider,
          token: body.token,
          redirect: body.redirect,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }),
    }),
    getMe: builder.query<AuthUser, string>({
      query: () => ({
        url: `${AUTH_API_BASE_URL}/me`,
        method: "GET",
      }),
    }),
    logout: builder.mutation<null, void>({
      query: () => ({
        url: `${AUTH_API_BASE_URL}/logout`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useLoginWithGoogleMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
