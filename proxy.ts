import { NextResponse, type NextRequest } from "next/server";

const AUTH_API_ME_URL = "https://api.loclaptrinh.com/lmsuser/me";
const AUTH_TOKEN_COOKIE = "lms_auth_token";

function redirectToLogin(request: NextRequest, clearToken = false) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  const response = NextResponse.redirect(loginUrl);

  if (clearToken) {
    response.cookies.delete(AUTH_TOKEN_COOKIE);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  let token: string | undefined;

  try {
    token = cookieToken ? decodeURIComponent(cookieToken) : undefined;
  } catch {
    return redirectToLogin(request, true);
  }

  const headers = new Headers({ Accept: "application/json" });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(AUTH_API_ME_URL, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (response.status === 401) {
      return redirectToLogin(request, true);
    }

    if (!token) {
      return redirectToLogin(request, true);
    }

    if (!response.ok) {
      console.error("Session verification failed:", response.status);
      return NextResponse.json(
        { message: "Không thể xác thực phiên đăng nhập." },
        { status: 503 },
      );
    }

    const payload: unknown = await response.json();

    if (
      !payload ||
      typeof payload !== "object" ||
      !("status" in payload) ||
      payload.status !== 1
    ) {
      console.error("Session verification returned an invalid response.");
      return NextResponse.json(
        { message: "API xác thực trả về dữ liệu không hợp lệ." },
        { status: 503 },
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Unable to verify the login session:", error);
    return NextResponse.json(
      { message: "Không thể kết nối tới dịch vụ xác thực." },
      { status: 503 },
    );
  }
}

export const config = {
  matcher: ["/", "/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
