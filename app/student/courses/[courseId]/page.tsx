"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { StudentShell } from "@/components/StudentShell";
import { isCourseFree } from "@/lib/course-access";
import {
  formatPriceVnd,
  getCourseRating,
  getCourseSummary,
  getCourseVisualTheme,
  getTotalDuration,
  type StudentCourse,
} from "@/lib/course-marketplace";
import { getDemoCourseById } from "@/lib/ui-demo-data";
import type { CourseResponseShape } from "@/typing";

type CourseResponse = CourseResponseShape;

type CourseAccessResponse = {
  success?: boolean;
  canAccess?: boolean;
  reason?: string;
  isFreeCourse?: boolean;
  hasEnrollment?: boolean;
  hasPaidOrder?: boolean;
  isTeacherOrAdmin?: boolean;
  message?: string;
};

type MyCoursesResponse = {
  success?: boolean;
  courses?: Array<{
    progress?: number;
  }>;
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [course, setCourse] = useState<StudentCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [purchaseError, setPurchaseError] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [previewLessonIndex, setPreviewLessonIndex] = useState<number | null>(null);
  const [lessonSearch, setLessonSearch] = useState("");

  const teacherMode = false;
  const isSignedIn = false;

  async function fetchCourse(resolvedCourseId: string, mounted = true) {
    try {
      setLoading(true);
      setError("");

      const demoCourse = getDemoCourseById(resolvedCourseId);

      if (!demoCourse) {
        throw new Error("Không tìm thấy khóa học");
      }

      if (mounted) {
        setCourse(demoCourse as StudentCourse);
      }
    } catch (fetchError) {
      console.error(fetchError);

      if (mounted) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải khóa học",
        );
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let mounted = true;

    async function resolveParamsAndFetch() {
      const { courseId: resolvedCourseId } = await params;

      if (!mounted) {
        return;
      }

      setCourseId(resolvedCourseId);
      await fetchCourse(resolvedCourseId, mounted);
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
        setCheckingEnrollment(true);

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
          setCheckingEnrollment(false);
        }
      }
    }

    void fetchEnrollmentStatus();

    return () => {
      mounted = false;
    };
  }, [courseId, teacherMode]);

  useEffect(() => {
    if (!courseId || teacherMode) {
      return;
    }

    let mounted = true;

    async function fetchLearningProgress() {
      try {
        if (!mounted) {
          return;
        }

        setLearningProgress(42);
      } catch (progressError) {
        console.error(progressError);
      }
    }

    void fetchLearningProgress();

    return () => {
      mounted = false;
    };
  }, [courseId, teacherMode]);

  function redirectToCourseSignIn() {
    const returnBackUrl =
      courseId ? `/student/courses/${courseId}` : "/student/courses";
    router.push(returnBackUrl);
  }

  async function handleCreateOrder() {
    if (!courseId) {
      redirectToCourseSignIn();
      return;
    }

    try {
      setIsCreatingOrder(true);
      setPurchaseError("");

      router.push(`/learn/${courseId}/0`);
    } catch (createOrderError) {
      console.error(createOrderError);
      setPurchaseError(
        createOrderError instanceof Error
          ? createOrderError.message
          : "Không thể tạo đơn hàng",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  }

  const isAccessLoading = !teacherMode && checkingEnrollment;

  if (loading || isAccessLoading) {
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
  const firstLessonHref =
    lessons.length > 0 ? `/learn/${course._id}/0` : `/student/courses/${course._id}`;
  const canLearn = teacherMode || isEnrolled;
  const freeCourse = isCourseFree(course);
  const courseSummary = getCourseSummary(course);
  const previewLesson =
    previewLessonIndex !== null ? lessons[previewLessonIndex] || null : null;
  const accessStatusMessage = canLearn
    ? "Bạn đã có quyền truy cập"
    : "Bạn chưa có quyền truy cập";
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
  const learningOutcomes = getLearningOutcomes(course);
  const completedLessons = Math.min(
    lessons.length,
    Math.round((learningProgress / 100) * lessons.length),
  );
  const primaryCta = getPrimaryCta({
    isSignedIn,
    canLearn,
    freeCourse,
    isCreatingOrder,
    firstLessonHref,
  });

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
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.78fr)_300px] lg:items-start">
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
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                    {courseSummary}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                    <span className="font-medium text-amber-600">★ {rating.rating}</span>
                    <span className="text-slate-300">·</span>
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
                {learningOutcomes.map((item) => (
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
                    <p className="mt-1 text-sm text-slate-500">
                      {lessons.length} bài học · {compactDuration}
                    </p>
                  </div>

                  <label className="group flex w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-blue-300 focus-within:bg-white sm:w-[260px]">
                    <SearchIcon className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                    <input
                      value={lessonSearch}
                      onChange={(event) => setLessonSearch(event.target.value)}
                      placeholder="Tìm bài học..."
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>
                </div>
              </div>

              {canLearn ? (
                <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Đã học {completedLessons} / {lessons.length} bài
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {Math.round(learningProgress)}%
                      </p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:max-w-[220px]">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(135deg,#2563eb_0%,#38bdf8_100%)]"
                        style={{ width: `${Math.max(0, Math.min(100, learningProgress))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

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
                    const isPreview = Boolean(lesson.isFreePreview);

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
                            {lesson.description?.trim() ? (
                              <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                                {lesson.description}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden text-sm text-slate-500 sm:inline">
                              {lesson.duration || "--:--"}
                            </span>
                            {!canLearn && isPreview ? (
                              <button
                                type="button"
                                onClick={() => setPreviewLessonIndex(index)}
                                className="inline-flex h-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                              >
                                Học thử
                              </button>
                            ) : canLearn ? (
                              <Link
                                href={`/learn/${course._id}/${index}`}
                                className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-3.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                              >
                                Học
                              </Link>
                            ) : (
                              <span className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-500">
                                <LockClosedIcon className="mr-1.5 h-3.5 w-3.5" />
                                Khóa
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="self-start lg:sticky lg:top-[100px]">
            <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_44px_-32px_rgba(15,23,42,0.2)]">
              <div className="p-4">
                <div>
                  <p className="text-[1.7rem] font-bold tracking-[-0.03em] text-slate-950">
                    {formatPriceVnd(course.discountPrice ?? course.price)}
                  </p>
                  {course.originalPrice && course.originalPrice > 0 ? (
                    <p className="mt-1 text-sm text-slate-400 line-through">
                      {formatPriceVnd(course.originalPrice)}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4">
                  {primaryCta.type === "link" ? (
                    <Link
                      href={primaryCta.href}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_100%)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                    >
                      {primaryCta.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={primaryCta.onClick === "signIn" ? redirectToCourseSignIn : () => void handleCreateOrder()}
                      disabled={primaryCta.loading}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_100%)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {primaryCta.label}
                    </button>
                  )}
                </div>

                <p className="mt-3 text-sm text-slate-500">{accessStatusMessage}</p>

                {purchaseError ? (
                  <div className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {purchaseError}
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </section>
      </StudentShell>

      {previewLesson ? (
        <PreviewLessonModal
          course={course}
          lesson={previewLesson}
          onClose={() => setPreviewLessonIndex(null)}
          onBuyCourse={() => void handleCreateOrder()}
          isCreatingOrder={isCreatingOrder}
          freeCourse={freeCourse}
        />
      ) : null}
    </>
  );
}

function getPrimaryCta({
  isSignedIn,
  canLearn,
  freeCourse,
  isCreatingOrder,
  firstLessonHref,
}: {
  isSignedIn: boolean;
  canLearn: boolean;
  freeCourse: boolean;
  isCreatingOrder: boolean;
  firstLessonHref: string;
}) {
  if (canLearn || freeCourse) {
    return {
      type: "link" as const,
      label: "Bắt đầu học",
      href: firstLessonHref,
    };
  }

  return {
    type: "button" as const,
    label: isSignedIn
      ? isCreatingOrder
        ? "Đang tạo đơn..."
        : "Mua khóa học"
      : "Mua khóa học",
    onClick: isSignedIn ? ("buy" as const) : ("signIn" as const),
    loading: isSignedIn ? isCreatingOrder : false,
  };
}

function getLearningOutcomes(course: StudentCourse) {
  const category = course.category?.trim();

  if (category === "AI") {
    return [
      "Hiểu quy trình làm AI Product Manager",
      "Biết viết PRD cho sản phẩm AI",
      "Biết dùng AI Coding để tạo MVP",
      "Biết kiểm thử và cải tiến sản phẩm",
    ];
  }

  if (category === "Business") {
    return [
      "Biết phân tích yêu cầu và luồng nghiệp vụ",
      "Viết tài liệu đặc tả rõ ràng hơn",
      "Làm việc tốt hơn với team product và tech",
      "Tư duy hệ thống khi triển khai tính năng",
    ];
  }

  if (category === "Design") {
    return [
      "Nắm được tư duy UIUX cho sản phẩm số",
      "Thiết kế luồng trải nghiệm gọn và rõ",
      "Biết dựng wireframe cho bài toán thực tế",
      "Cải thiện khả năng cộng tác với product team",
    ];
  }

  return [
    "Hiểu rõ lộ trình học và cách áp dụng thực tế",
    "Biết triển khai từ kiến thức đến bài tập cụ thể",
    "Làm việc tốt hơn với sản phẩm và người dùng",
    "Tăng tốc quá trình học và tự xây dựng kỹ năng",
  ];
}

function PreviewLessonModal({
  course,
  lesson,
  onClose,
  onBuyCourse,
  isCreatingOrder,
  freeCourse,
}: {
  course: StudentCourse;
  lesson: NonNullable<StudentCourse["lessons"]>[number];
  onClose: () => void;
  onBuyCourse: () => void;
  isCreatingOrder: boolean;
  freeCourse: boolean;
}) {
  const isBunnyVideo = lesson.videoSource === "bunny";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-lesson-title"
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-200/10 bg-white shadow-[0_40px_120px_-30px_rgba(15,23,42,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_72%)] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Học thử khóa học
            </p>
            <h2
              id="preview-lesson-title"
              className="mt-2 truncate text-lg font-semibold text-slate-950 sm:text-xl"
            >
              {lesson.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="Đóng modal học thử"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 sm:p-5">
          <div className="overflow-hidden rounded-[20px] bg-black shadow-2xl">
            <div className="aspect-video">
              {lesson.videoUrl ? (
                isBunnyVideo ? (
                  <iframe
                    src={lesson.videoUrl}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="h-full w-full border-0"
                    title={lesson.title}
                  />
                ) : (
                  <video
                    src={lesson.videoUrl}
                    controls
                    autoPlay
                    className="h-full w-full bg-black"
                  />
                )
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-300">
                  Bài học thử này chưa có video.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-950">{course.title}</p>
            <p className="mt-1 truncate text-sm text-slate-500">
              {lesson.description || "Xem trước nội dung bài học trước khi đăng ký khóa học."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {!freeCourse ? (
              <>
                <button
                  type="button"
                  onClick={onBuyCourse}
                  disabled={isCreatingOrder}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingOrder ? "Đang tạo đơn..." : "Mua khóa học"}
                </button>
                <Link
                  href="/student/redeem-code"
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Kích hoạt mã
                </Link>
              </>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
                Khóa học miễn phí
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
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
