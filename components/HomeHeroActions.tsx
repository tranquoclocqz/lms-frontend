"use client";

import Link from "next/link";

export function HomeHeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/my-courses"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Khóa học của tôi
      </Link>
      <Link
        href="/student/courses"
        className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
      >
        Khám phá khóa học
      </Link>
    </div>
  );
}
