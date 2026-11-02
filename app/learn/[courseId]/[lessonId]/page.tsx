"use client";

import Link from "next/link";
import type { SVGProps } from "react";
import { useEffect, useMemo, useState } from "react";
import { StudentShell } from "@/components/StudentShell";
import { useGetLessonsQuery } from "@/lib/redux/coursesApi";
import type { StudentCourse } from "@/typing";
import { HlsLessonVideo } from "./HlsLessonVideo";
import { getDurationString } from "@/lib/course-marketplace";
import Forbidden from "@/components/Forbidden";

export default function LearningPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [course, setCourse] = useState<StudentCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessChecked, setAccessChecked] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const teacherMode = false;
  const {
    data: lessonsResponse,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    refetch: refetchLessons,
  } = useGetLessonsQuery(courseId, { skip: !courseId });

  useEffect(() => {
    let mounted = true;

    async function resolveParamsAndFetch() {
      const resolvedParams = await params;

      if (!mounted) {
        return;
      }

      setCourseId(resolvedParams.courseId);
      setLessonId(resolvedParams.lessonId);
      setCourse({ _id: resolvedParams.courseId, title: "", lessons: [] });
      setError("");
      setLoading(false);
    }

    void resolveParamsAndFetch();

    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!courseId || teacherMode) {
      return;
    }

    let mounted = true;

    async function fetchEnrollmentStatus() {
      try {
        setAccessChecked(false);

        if (mounted) {
          setIsEnrolled(true);
        }
      } catch (enrollmentError) {
        console.error(enrollmentError);

        if (mounted) {
          setIsEnrolled(false);
        }
      } finally {
        if (mounted) {
          setAccessChecked(true);
        }
      }
    }

    void fetchEnrollmentStatus();

    return () => {
      mounted = false;
    };
  }, [courseId, teacherMode]);

  const lessons = useMemo(
    () =>
      lessonsResponse?.data?.map((lesson, index) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        videoSource: "local" as const,
        videoUrl: lesson.video_url,
        duration: getDurationString(Number(lesson.duration_seconds) ?? 0),
        isFreePreview: lesson.is_preview === 1,
        order: lesson.sort_order ?? index + 1,
      })) || [],
    [lessonsResponse?.data],
  );
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === Number(lessonId));
  const fallbackLesson =
    Number.isInteger(lessonIndex) && lessonIndex >= 0
      ? lessons[lessonIndex]
      : undefined;
  const activeLesson = fallbackLesson;
  const hasCourseAccess = teacherMode || isEnrolled;
  const isAccessReady = teacherMode || accessChecked;
  const canWatchActiveLesson = Boolean(
    activeLesson &&
    (teacherMode || hasCourseAccess || Boolean(activeLesson.isFreePreview)),
  );

  const derivedError = useMemo(() => {
    if (error) {
      return error;
    }

    if (!loading && !course) {
      return "Không tìm thấy khóa học";
    }

    if (!isLessonsLoading && isLessonsError) {
      return "Không thể tải bài học";
    }

    if (!loading && !Number.isInteger(lessonIndex)) {
      return "Chỉ mục bài học không hợp lệ";
    }

    if (!loading && lessonIndex < 0) {
      return "Chỉ mục bài học không hợp lệ";
    }

    if (!loading && course && !activeLesson) {
      return "Không tìm thấy bài học";
    }

    return "";
  }, [activeLesson, course, error, isLessonsError, isLessonsLoading, lessonIndex, loading]);

  if (loading || isLessonsLoading || !isAccessReady) {
    return (
      <StudentShell
        title={course?.title || "Bài học"}
        description="Đang chuẩn bị không gian học tập của bạn."
        activeHref="/student/courses"
        hideHero
        hideSidebar
        contentWidth="wide"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-6">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="aspect-video animate-pulse rounded-[28px] bg-slate-200" />
            <div className="rounded-[28px] bg-white p-6">
              <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
          </main>
          <aside className="rounded-[28px] bg-white p-6">
            <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-[24px] bg-slate-100"
                />
              ))}
            </div>
          </aside>
        </div>
      </StudentShell>
    );
  }

  if (derivedError) {
    return (
      <StudentShell
        title={course?.title || "Bài học"}
        description="Không thể mở nội dung học tập lúc này."
        activeHref="/student/courses"
        hideHero
        hideSidebar
      >
        <Forbidden />
      </StudentShell>
    );
  }

  return (
    <StudentShell
      title={course?.title || "Bài học"}
      description="Tiếp tục bài học và theo dõi tiến trình của bạn."
      activeHref="/student/courses"
      hideHero
      hideSidebar
      contentWidth="wide"
    >
      <div className="text-slate-950">
        <div
          className={`grid min-h-screen grid-cols-1 gap-6 ${sidebarExpanded
              ? "lg:grid-cols-[minmax(0,1fr)_360px]"
              : "lg:grid-cols-[minmax(0,1fr)_92px]"
            }`}
        >
          <main className="min-w-0">
            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.2)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                    {activeLesson?.title}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">{course?.title}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_22px_60px_-42px_rgba(15,23,42,0.2)]">
              <div className="aspect-video bg-black">
                {canWatchActiveLesson && activeLesson?.videoUrl ? (
                  <HlsLessonVideo
                    key={activeLesson.id ?? activeLesson.videoUrl}
                    src={activeLesson.videoUrl}
                    watermark="@id:1"
                  />
                ) : canWatchActiveLesson ? (
                  <div className="flex h-full items-center justify-center text-center text-sm text-slate-300">
                    Bài học này chưa có video.
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.22),transparent_38%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-blue-300">
                      <LockClosedIcon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-white">
                      Bài học này đang bị khóa
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                      Bài học này cần mua khóa học hoặc kích hoạt mã để xem.
                    </p>
                    <Link
                      href={`/student/courses/${courseId}`}
                      className="mt-6 inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >

                      Quay lại trang chi tiết khóa học
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>

          <aside className="rounded-[28px] border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
              {sidebarExpanded ? (
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-slate-950">
                    Nội dung khóa học
                  </h2>
                  <div className="mt-1 truncate text-sm text-slate-500">
                    {course?.title}
                  </div>
                </div>
              ) : (
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:w-full lg:text-center">
                  DS
                </div>
              )}

              <button
                type="button"
                onClick={() => setSidebarExpanded((previous) => !previous)}
                className="ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label={sidebarExpanded ? "Thu gọn danh sách bài học" : "Mở rộng danh sách bài học"}
              >
                <ChevronRightIcon
                  className={`h-4 w-4 ${sidebarExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {sidebarExpanded ? (
              <div className="h-[calc(100vh-220px)] overflow-y-auto px-3 py-3 sm:px-4">
                <div className="space-y-2">
                  {lessons.map((lesson, index) => {
                    const isActive = index === lessonIndex;
                    const canWatchLesson =
                      teacherMode || hasCourseAccess || Boolean(lesson.isFreePreview);

                    return (
                      <Link
                        key={`${lesson.title}-${index}`}
                        href={`/learn/${course?._id}/${lesson.id ?? index}`}
                        className={`block rounded-[24px] border px-4 py-4 transition ${isActive
                            ? "border-blue-200 bg-[linear-gradient(135deg,#eff6ff_0%,#eef2ff_100%)] text-blue-700 shadow-[0_18px_40px_-30px_rgba(37,99,235,0.45)]"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-semibold ${isActive
                                ? "bg-white text-blue-700"
                                : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={`truncate text-sm font-medium ${isActive ? "text-blue-700" : "text-slate-900"
                                  }`}
                                title={lesson.title}
                              >
                                {lesson.title}
                              </p>
                              {!canWatchLesson ? (
                                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                                  Khóa
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <p
                                className={`truncate text-xs ${isActive ? "text-blue-600" : "text-slate-500"
                                  }`}
                                title={lesson.description || "Chưa có mô tả cho bài học này."}
                              >
                                {canWatchLesson
                                  ? lesson.description || "Chưa có mô tả cho bài học này."
                                  : "Cần mua hoặc kích hoạt để xem"}
                              </p>
                              <span
                                className={`shrink-0 text-[11px] ${isActive ? "text-blue-600" : "text-slate-500"
                                  }`}
                              >
                                {lesson.duration || "--:--"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-220px)] items-start justify-center px-3 py-4">
                <div className="text-xs font-medium tracking-[0.18em] text-slate-400 [writing-mode:vertical-rl] [text-orientation:mixed]">
                  {lessons.length} bài học
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </StudentShell>
  );
}

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
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
