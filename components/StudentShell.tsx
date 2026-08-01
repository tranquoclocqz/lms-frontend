"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, SVGProps } from "react";
import { useState } from "react";
import { BrainCourseLogo } from "@/components/BrainCourseLogo";
import type { ShellSearch, SidebarNavItem } from "@/typing";

type StudentShellProps = {
  title: string;
  description: string;
  sidebarMode?: "auto" | "public" | "student";
  activeHref?: string;
  search?: ShellSearch;
  actions?: ReactNode;
  spotlight?: ReactNode;
  hideHero?: boolean;
  contentWidth?: "default" | "wide";
  children: ReactNode;
};

const publicNavItems: SidebarNavItem[] = [
  { href: "/", label: "Khám phá", icon: CompassIcon },
  { href: "/student/courses", label: "Khóa học", icon: BookOpenIcon },
  { href: "/student/courses#coming-soon", label: "Sắp ra mắt", icon: SparklesIcon },
];

const studentNavItems: SidebarNavItem[] = [
  { href: "/", label: "Khám phá", icon: CompassIcon },
  { href: "/student/courses", label: "Khóa học", icon: BookOpenIcon },
  { href: "/my-courses", label: "Khóa học của tôi", icon: PlayCircleIcon },
  { href: "/student/profile", label: "Cài đặt", icon: CogIcon },
  { href: "/student/courses#coming-soon", label: "Sắp ra mắt", icon: SparklesIcon },
];

const teacherShortcut: SidebarNavItem = {
  href: "/courses",
  label: "Khu vực giảng viên",
  icon: AcademicCapIcon,
};

export function StudentShell({
  title,
  description,
  activeHref,
  search,
  actions,
  spotlight,
  hideHero = false,
  contentWidth = "default",
  children,
}: StudentShellProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isSignedIn = false;
  const primaryEmail = "";
  const teacherMode = false;
  const currentUrl = pathname;
  const signInHref = `/student/courses`;
  const signUpHref = `/student/courses`;

  const navItems = isSignedIn ? studentNavItems : publicNavItems;
  const profileName = "BrainCourse";
  const resolvedActiveHref = getResolvedActiveHref(navItems, activeHref || pathname);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="flex min-h-screen w-full">
        <StudentSidebar
          navItems={navItems}
          activeHref={resolvedActiveHref}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          teacherMode={teacherMode}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f5f7fb]/95 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 lg:hidden"
                aria-label="Mở menu điều hướng"
              >
                <MenuIcon className="h-5 w-5" />
              </button>

              {search ? (
                <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.18)] transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
                  <SearchIcon className="h-5 w-5 shrink-0 text-slate-400 transition group-focus-within:text-blue-600" />
                  <input
                    value={search.value}
                    onChange={(event) => search.onChange(event.target.value)}
                    placeholder={search.placeholder || "Tìm kiếm khóa học, bài học, danh mục..."}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
              ) : (
                <div className="flex flex-1 items-center rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.18)]">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                  <span className="ml-3 text-sm text-slate-400">
                    Không gian học tập BrainCourse
                  </span>
                </div>
              )}

              <div className="hidden items-center gap-3 xl:flex">
                <div className="flex items-center gap-2">
                  <Link
                    href={signInHref}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href={signUpHref}
                    className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#4f46e5_0%,#2563eb_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_-18px_rgba(79,70,229,0.8)] transition hover:brightness-110"
                  >
                    Tạo tài khoản
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 px-3 py-5 sm:px-5 lg:px-6 lg:py-6">
            <div
              className={`mx-auto w-full space-y-5 ${
                contentWidth === "wide" ? "max-w-[1360px]" : "max-w-6xl"
              }`}
            >
              {hideHero ? null : (
                <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_26px_70px_-45px_rgba(15,23,42,0.22)]">
                  <div className="grid gap-5 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] xl:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                        Student experience
                      </p>
                      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                        {title}
                      </h1>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                        {description}
                      </p>
                      {actions ? (
                        <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
                      ) : null}
                    </div>

                    <div className="rounded-[28px] bg-[linear-gradient(135deg,#4f46e5_0%,#2563eb_56%,#38bdf8_100%)] p-5 text-white shadow-[0_26px_60px_-34px_rgba(79,70,229,0.55)]">
                      {spotlight || (
                        <>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                            BrainCourse
                          </p>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                            Clean learning dashboard
                          </h2>
                          <p className="mt-3 text-sm leading-6 text-white/80">
                            Tập trung vào khám phá khóa học, theo dõi tiến độ và
                            vào học nhanh mà không làm thay đổi backend hiện tại.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

type SidebarProps = {
  navItems: SidebarNavItem[];
  activeHref: string;
  isOpen: boolean;
  onClose: () => void;
  teacherMode: boolean;
};

function StudentSidebar({
  navItems,
  activeHref,
  isOpen,
  onClose,
  teacherMode,
}: SidebarProps) {
  const TeacherShortcutIcon = teacherShortcut.icon;

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          aria-label="Đóng menu điều hướng"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] max-w-[84vw] -translate-x-full flex-col border-r border-slate-200 bg-white px-3 py-4 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.3)] transition-transform duration-300 lg:sticky lg:top-0 lg:z-10 lg:min-h-screen lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link href="/" onClick={onClose}>
            <BrainCourseLogo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
            aria-label="Đóng menu điều hướng"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {teacherMode ? (
          <div className="mt-3">
            <Link
              href={teacherShortcut.href}
              onClick={onClose}
              className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <TeacherShortcutIcon className="h-5 w-5 shrink-0" />
              <span>{teacherShortcut.label}</span>
            </Link>
          </div>
        ) : null}

        <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">BrainCourse</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Learning dashboard
          </p>
        </div>
      </aside>
    </>
  );
}

function isNavItemActive(href: string, currentPath: string) {
  const cleanHref = href.split("#")[0];

  if (cleanHref === "/") {
    return currentPath === "/";
  }

  return currentPath === cleanHref || currentPath.startsWith(`${cleanHref}/`);
}

function getResolvedActiveHref(navItems: SidebarNavItem[], currentPath: string) {
  const exactMatch = navItems.find((item) => item.href === currentPath);
  if (exactMatch) {
    return exactMatch.href;
  }

  const firstMatch = navItems.find((item) => isNavItemActive(item.href, currentPath));
  return firstMatch?.href || currentPath;
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 9.5-4 1.5-1.5 4 4-1.5 1.5-4Z" />
    </svg>
  );
}

function BookOpenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h11.25a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 0 17.25 15H6a2.25 2.25 0 0 0-2.25 2.25V6.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4.5v10.5A2.25 2.25 0 0 1 8.25 12.75H19.5" />
    </svg>
  );
}

function PlayCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 9.75 4.5 2.25-4.5 2.25v-4.5Z" />
    </svg>
  );
}

function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 15 .75 2.25 2.25.75-2.25.75-.75 2.25-.75-2.25L16.5 18l2.25-.75.75-2.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 14.25.75 2.25 2.25.75-2.25.75-.75 2.25-.75-2.25L1.5 18l2.25-.75.75-2.25Z" />
    </svg>
  );
}

function CogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3.84h3l.33 1.63a1.5 1.5 0 0 0 2.1 1.06l1.44-.63 2.12 2.12-.63 1.44a1.5 1.5 0 0 0 1.06 2.1l1.63.33v3l-1.63.33a1.5 1.5 0 0 0-1.06 2.1l.63 1.44-2.12 2.12-1.44-.63a1.5 1.5 0 0 0-2.1 1.06l-.33 1.63h-3l-.33-1.63a1.5 1.5 0 0 0-2.1-1.06l-1.44.63-2.12-2.12.63-1.44a1.5 1.5 0 0 0-1.06-2.1l-1.63-.33v-3l1.63-.33a1.5 1.5 0 0 0 1.06-2.1l-.63-1.44 2.12-2.12 1.44.63a1.5 1.5 0 0 0 2.1-1.06l.33-1.63Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function AcademicCapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25 4.5 10.5 12 6.75l7.5 3.75L12 14.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75v3.375c0 .621 1.343 1.875 3 1.875s3-1.254 3-1.875V12.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5v4.125" />
    </svg>
  );
}
