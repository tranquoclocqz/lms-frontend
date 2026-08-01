"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type MenuItem = {
  label: string;
  href: string;
  Icon: (props: IconProps) => ReactElement;
  matches: (pathname: string) => boolean;
};

const teacherMenuItems: MenuItem[] = [
  {
    label: "Quản lý khóa học",
    href: "/courses",
    Icon: BookOpenIcon,
    matches: (pathname) =>
      pathname === "/courses" ||
      (pathname.startsWith("/courses/") && !pathname.startsWith("/courses/new")),
  },
  {
    label: "Tạo khóa học",
    href: "/courses/new",
    Icon: PencilSquareIcon,
    matches: (pathname) => pathname === "/courses/new",
  },
  {
    label: "Mã kích hoạt",
    href: "/activation-codes",
    Icon: KeyIcon,
    matches: (pathname) =>
      pathname === "/activation-codes" ||
      pathname.startsWith("/activation-codes/"),
  },
  {
    label: "Quản lý học viên",
    href: "/students",
    Icon: UsersIcon,
    matches: (pathname) =>
      pathname === "/students" || pathname.startsWith("/students/"),
  },
  {
    label: "Đơn hàng",
    href: "/orders",
    Icon: ClipboardListIcon,
    matches: (pathname) =>
      pathname === "/orders" || pathname.startsWith("/orders/"),
  },
  {
    label: "Cài đặt",
    href: "/settings",
    Icon: Cog6ToothIcon,
    matches: (pathname) =>
      pathname === "/settings" || pathname.startsWith("/settings/"),
  },
];

function shouldShowTeacherShell(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/courses" ||
    pathname.startsWith("/courses/") ||
    pathname === "/activation-codes" ||
    pathname.startsWith("/activation-codes/") ||
    pathname === "/students" ||
    pathname.startsWith("/students/") ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/") ||
    pathname === "/learning" ||
    pathname.startsWith("/learning/")
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showTeacherShell = shouldShowTeacherShell(pathname);

  if (!showTeacherShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <aside className="hidden w-[248px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-full flex-col px-3 py-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#2563eb_100%)] text-white shadow-[0_18px_40px_-26px_rgba(37,99,235,0.55)]">
              <AcademicCapIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-semibold tracking-tight text-slate-900">
                BrainCourse
              </p>
              <p className="text-xs text-slate-500">Không gian giảng viên</p>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {teacherMenuItems.map(({ label, href, Icon, matches }) => {
              const isActive = matches(pathname);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-500 group-hover:text-slate-900"
                    }`}
                  />
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
            Không gian này dành cho quản lý khóa học, kích hoạt, học viên và
            đơn hàng.
          </div>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}

function AcademicCapIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14.25 4.5 10.5 12 6.75l7.5 3.75L12 14.25Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75v3.375c0 .621 1.343 1.875 3 1.875s3-1.254 3-1.875V12.75"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5v4.125"
      />
    </svg>
  );
}

function BookOpenIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h11.25a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 0 17.25 15H6a2.25 2.25 0 0 0-2.25 2.25V6.75Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4.5v10.5A2.25 2.25 0 0 1 8.25 12.75H19.5"
      />
    </svg>
  );
}

function KeyIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a4.5 4.5 0 1 1-3.792 6.925l-5.708 5.708a1.5 1.5 0 0 1-1.06.44H3.75v-1.44a1.5 1.5 0 0 1 .44-1.06l1.69-1.69h1.62v-1.62l1.69-1.69a1.5 1.5 0 0 1 1.06-.44h1.708A4.5 4.5 0 0 1 15.75 5.25Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 6.75h.008v.008H18V6.75Z"
      />
    </svg>
  );
}

function Cog6ToothIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.214 1.286a1.125 1.125 0 0 0 1.682.768l1.132-.66a1.125 1.125 0 0 1 1.37.17l1.833 1.833c.39.39.458.997.17 1.37l-.66 1.132a1.125 1.125 0 0 0 .768 1.682l1.286.214c.542.09.94.56.94 1.11v2.592c0 .55-.398 1.02-.94 1.11l-1.286.214a1.125 1.125 0 0 0-.768 1.682l.66 1.132c.288.373.22.98-.17 1.37l-1.833 1.833a1.125 1.125 0 0 1-1.37.17l-1.132-.66a1.125 1.125 0 0 0-1.682.768l-.214 1.286c-.09.542-.56.94-1.11.94h-2.592c-.55 0-1.02-.398-1.11-.94l-.214-1.286a1.125 1.125 0 0 0-1.682-.768l-1.132.66a1.125 1.125 0 0 1-1.37-.17l-1.833-1.833a1.125 1.125 0 0 1-.17-1.37l.66-1.132a1.125 1.125 0 0 0-.768-1.682l-1.286-.214a1.125 1.125 0 0 1-.94-1.11v-2.592c0-.55.398-1.02.94-1.11l1.286-.214a1.125 1.125 0 0 0 .768-1.682l-.66-1.132a1.125 1.125 0 0 1 .17-1.37l1.833-1.833a1.125 1.125 0 0 1 1.37-.17l1.132.66a1.125 1.125 0 0 0 1.682-.768l.214-1.286Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function PencilSquareIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM19.5 7.125 16.875 4.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 14.25v4.125A1.125 1.125 0 0 1 16.875 19.5H4.125A1.125 1.125 0 0 1 3 18.375V5.625A1.125 1.125 0 0 1 4.125 4.5H8.25"
      />
    </svg>
  );
}

function UsersIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 21a5.25 5.25 0 0 0-10.5 0"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 21a4.5 4.5 0 0 0-3.375-4.352"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 3.75a3 3 0 0 1 0 6"
      />
    </svg>
  );
}

function ClipboardListIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5.25A2.25 2.25 0 0 1 11.25 3h1.5A2.25 2.25 0 0 1 15 5.25h1.5A2.25 2.25 0 0 1 18.75 7.5v10.5a2.25 2.25 0 0 1-2.25 2.25h-9A2.25 2.25 0 0 1 5.25 18V7.5A2.25 2.25 0 0 1 7.5 5.25H9Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 10.5h6M9 14.25h6"
      />
    </svg>
  );
}
