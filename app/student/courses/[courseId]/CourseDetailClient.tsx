"use client";

import { StudentShell } from "@/components/StudentShell";
import {
  getCourseRating,
  getCourseSummary,
  getCourseVisualTheme,
  getDurationString,
  getTotalDuration
} from "@/lib/course-marketplace";
import type { StudentCourse } from "@/typing";
import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import { useState } from "react";

export default function CourseDetailPage({
  params,
  initialCourse,
  initialError = "",
}: {
  params: Promise<{ courseId: string }>;
  initialCourse: StudentCourse | null;
  initialError?: string;
}) {
  const [course] = useState<StudentCourse | null>(initialCourse);
  const [loading] = useState(false);
  const [error] = useState(initialError);
  const [lessonSearch, setLessonSearch] = useState("");

  if (loading) {
    return (
      <StudentShell
        title="Đang tải khóa học"
        description="Hệ thống đang lấy dữ liệu khóa học và quyền truy cập."
        activeHref="/student/courses"
        sidebarMode="student"
        hideHero
        contentWidth="wide"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.75fr)_340px]">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
              <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 h-10 w-4/5 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
              <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
              <div className="mt-5 space-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[68px] animate-pulse rounded-[16px] bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
            <div className="aspect-video animate-pulse rounded-[18px] bg-slate-200" />
            <div className="mt-5 h-10 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-4 h-16 animate-pulse rounded-[18px] bg-slate-100" />
          </div>
        </div>
      </StudentShell>
    );
  }

  if (error || !course) {
    return (
      <StudentShell
        title="Khóa học hiện không khả dụng"
        description="Không thể tải khóa học này vào thời điểm hiện tại."
        activeHref="/student/courses"
        sidebarMode="student"
        hideHero
        contentWidth="wide"
      >
        <div className="mx-auto max-w-3xl rounded-[24px] border border-rose-200 bg-white p-10 text-center shadow-[0_24px_60px_-42px_rgba(225,29,72,0.25)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ExclamationTriangleIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">
            Khóa học hiện không khả dụng
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error || "Không thể tải khóa học này."}
          </p>
          <Link
            href="/student/courses"
            className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Quay lại danh sách khóa học
          </Link>
        </div>
      </StudentShell>
    );
  }

  const lessons = course.lessons || [];
  const theme = getCourseVisualTheme(`${course.title}${course.category || ""}`);
  const rating = getCourseRating();
  const courseSummary = getCourseSummary(course);
 
  const filteredLessons = lessons
    .map((lesson, index) => ({ lesson, index }))
    .filter(({ lesson }) => {
      const query = lessonSearch.trim().toLowerCase();
      if (!query) {
        return true;
      }

      return [lesson.title || "", lesson.description || ""].some((value) =>
        value.toLowerCase().includes(query),
      );
    });
  const compactDuration = getTotalDuration(lessons);
  const learningOutcomes = course.meta_data?.outcome || undefined;

  return (
    <>
      <StudentShell
        title={course.title}
        description={courseSummary}
        activeHref="/student/courses"
        sidebarMode="student"
        hideHero
        contentWidth="wide"
      >
        <section>
          <div className="space-y-4">
            <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
              <div className="grid gap-4 p-5 lg:min-h-[168px] lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">
                    <Link href="/student/courses" className="transition hover:text-slate-600">
                      Khóa học
                    </Link>
                    <span className="px-2 text-slate-300">/</span>
                    <span className="truncate text-slate-500">{course.title}</span>
                  </p>
                  <h1 className="mt-2.5 text-[1.8rem] font-semibold tracking-tight text-slate-950 sm:text-[1.95rem]">
                    {course.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                    <span>{lessons.length} bài học</span>
                    <span className="text-slate-300">·</span>
                    <span>{compactDuration}</span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
                  <div className="relative aspect-video">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full ${theme.panelClassName}`} />
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.14)]">
              <h2 className="text-lg font-semibold text-slate-950">
                Bạn sẽ học được gì?
              </h2>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {learningOutcomes?.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
              <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      Nội dung khóa học
                    </h2>
                  </div>
                </div>
              </div>

              {filteredLessons.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <h3 className="text-lg font-semibold text-slate-950">
                    Không có bài học phù hợp
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Thử từ khóa khác để tìm đúng bài học trong khóa học này.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200/80">
                  {filteredLessons.map(({ lesson, index }) => {

                    return (
                      <div
                        key={`${lesson.title}-${index}`}
                        className="px-4 py-1.5 transition hover:bg-slate-50/70 sm:px-6"
                      >
                        <div className="flex min-h-[64px] items-center gap-4">
                          <div className="w-8 shrink-0 text-sm font-semibold text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-slate-950">
                              {lesson.title}
                            </h3>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden text-sm text-slate-500 sm:inline">
                              {getDurationString(lesson.duration ?? 0) || "--:--"}
                            </span>
                            <Link
                              href={`/learn/${course._id}/${lesson.id}`}
                              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-3.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                            >
                              Học
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </section>
      </StudentShell>
    </>
  );
}

function ExclamationTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12V16.5ZM10.29 3.86 1.82 18a2.25 2.25 0 0 0 1.93 3.375h16.5A2.25 2.25 0 0 0 22.18 18L13.71 3.86a1.98 1.98 0 0 0-3.42 0Z" />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
    </svg>
  );
}

function LockClosedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V8.25a4.5 4.5 0 1 0-9 0v2.25m-1.5 0h12a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5V12A1.5 1.5 0 0 1 6 10.5Z" />
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
