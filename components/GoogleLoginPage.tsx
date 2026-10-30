"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useLoginWithGoogleMutation,
  type GoogleLoginPayload,
} from "@/lib/redux/authApi";
import { persistAuthSession } from "@/lib/auth/session";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdClient = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select: boolean;
    context: "signin";
    ux_mode: "popup";
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type: "standard";
      size: "large";
      theme: "outline";
      text: "signin_with";
      shape: "rectangular";
      logo_alignment: "left";
    },
  ) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdClient;
      };
    };
  }
}

function getRedirectTarget() {
  const target = new URLSearchParams(window.location.search).get("next");

  if (target?.startsWith("/") && !target.startsWith("//")) {
    return target;
  }

  return "/";
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;

    if (data && typeof data === "object" && "message" in data) {
      return String(data.message);
    }

    if (data && typeof data === "object" && "error" in data) {
      return String(data.error);
    }

    if (data && typeof data === "object" && "data" in data) {
      const details = data.data;

      if (details && typeof details === "object" && "error" in details) {
        return String(details.error);
      }
    }
  }

  return "Đăng nhập Google thất bại. Vui lòng thử lại.";
}

export function GoogleLoginPage() {
  const router = useRouter();
  const googleButtonContainer = useRef<HTMLDivElement>(null);
  const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation();
  const [scriptReady, setScriptReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const clientId = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!scriptReady) {
      return;
    }

    const googleId = window.google?.accounts?.id;

    if (!clientId || !googleId || !googleButtonContainer.current) {
      return;
    }

    googleId.initialize({
      client_id: clientId,
      callback: (response) => {
        if (!response.credential) {
          setErrorMessage("Google không trả về ID token.");
          return;
        }

        const payload: GoogleLoginPayload = {
          token: response.credential,
          provider: "google",
          redirect: "/",
        };

        void loginWithGoogle(payload)
          .unwrap()
          .then((session) => {
            persistAuthSession(session);
            router.replace(getRedirectTarget());
          })
          .catch((error: unknown) => {
            setErrorMessage(getErrorMessage(error));
          });
      },
      auto_select: false,
      context: "signin",
      ux_mode: "popup",
    });

    googleButtonContainer.current.replaceChildren();
    googleId.renderButton(googleButtonContainer.current, {
      type: "standard",
      size: "large",
      theme: "outline",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }, [clientId, loginWithGoogle, router, scriptReady]);

  function handleGoogleLogin() {
    if (!clientId) {
      setErrorMessage(
        "Thiếu cấu hình NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID.",
      );
      console.log("4");
      return;
    }
    const googleButton =
      googleButtonContainer.current?.querySelector<HTMLElement>(
        '[role="button"]',
      );
      console.log("1");

    if (!googleButton) {
      setErrorMessage("Google OAuth chưa sẵn sàng. Vui lòng thử lại.");
      return;
    }
    setErrorMessage("");
    googleButton.click();
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() =>
          setErrorMessage("Không thể tải dịch vụ đăng nhập Google.")
        }
      />
      <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              BrainCourse
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Đăng nhập
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tiếp tục học tập với tài khoản Google của bạn.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.15a11 11 0 0 0 0 9.9l3.69-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.85 6.05l3.69 2.84C6.71 6.29 9.14 4.36 12 4.36Z"
              />
            </svg>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập Google"}
          </button>

          <div
            ref={googleButtonContainer}
            aria-hidden="true"
            className="hidden"
          />

          {errorMessage ? (
            <p
              className="mt-4 text-center text-sm text-red-600"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
        </section>
      </main>
    </>
  );
}
