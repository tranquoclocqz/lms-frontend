"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/typing";

const navItems: NavItem[] = [
  { href: "/my-courses", label: "Khóa học của tôi" },
  { href: "/courses", label: "Khu vực giảng viên" },
];

export function AuthNavbar() {
  const pathname = usePathname();
  const shouldHideNavbar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/my-courses" ||
    pathname.startsWith("/student/") ||
    pathname.startsWith("/learn/");

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-950"
          >
            BrainCourse
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex w-full flex-wrap items-center gap-3 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Đăng nhập
          </Link>
          <Link
            href="/student/courses"
            className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
