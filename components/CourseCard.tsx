"use client";

import Image from "next/image";
import Link from "next/link";
import {
  formatCourseCategory,
  formatPriceVnd,
  getCourseRating,
  getCourseVisualTheme,
} from "@/lib/course-marketplace";
import type { CourseLesson, StudentCourse } from "@/typing";

type CourseCardCourse = StudentCourse;

type CourseCardProps = {
  course: CourseCardCourse;
  mode: "student" | "admin";
  href?: string;
  studentLayout?: "default" | "minimal";
  studentState?: {
    canLearn?: boolean;
    progress?: number;
    ctaLabel?: string;
    statusLabel?: string;
  };
  onView?: (course: CourseCardCourse) => void;
  onEdit?: (course: CourseCardCourse) => void;
  onDelete?: (course: CourseCardCourse) => void;
  deleting?: boolean;
};

export function CourseCard({
  course,
  mode,
  href,
  studentLayout = "default",
  studentState,
  onView,
  onEdit,
  onDelete,
  deleting = false,
}: CourseCardProps) {
  const safeTitle = course.title?.trim() || "Khóa học BrainCourse";
  const displayAuthorName = "Cô Mai UI UX";
  const safeThumbnailUrl = course.thumbnailUrl?.trim() || "";
  const theme = getCourseVisualTheme(`${safeTitle}${course._id}`);
  const rating = getCourseRating();
  const primaryPrice = course.discountPrice ?? course.price;
  const originalPrice = course.originalPrice;
  const lessonCount = course.lessons?.length || 0;
  const isFreeCourse = !primaryPrice || Number(primaryPrice) <= 0;
  const badgeLabel = getDisplayBadge(isFreeCourse);
  const categoryLabel = getCategoryBadgeLabel(course.category);
  const studentCtaLabel =
    studentState?.ctaLabel ||
    (studentState?.canLearn
      ? studentState.progress && studentState.progress > 0
        ? "Tiếp tục học"
        : "Học ngay"
      : isFreeCourse
        ? "Học ngay"
        : "Xem chi tiết");
  const isMinimalStudentCard = mode === "student" && studentLayout === "minimal";
  const studentHref = href || `/student/courses/${course._id}`;

  if (mode === "student") {
    return (
      <Link href={studentHref} className="group block h-full rounded-[22px]">
        <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-34px_rgba(29,78,216,0.22)]">
          <CardMedia
            safeThumbnailUrl={safeThumbnailUrl}
            safeTitle={safeTitle}
            categoryLabel={categoryLabel}
            badgeLabel={badgeLabel}
            theme={theme}
            sizes={
              isMinimalStudentCard
                ? "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                : "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            }
          />
          <StudentCardBody
            title={safeTitle}
            authorName={displayAuthorName}
            rating={rating.rating}
            lessonCount={lessonCount}
            primaryPrice={primaryPrice}
            originalPrice={originalPrice}
            isFreeCourse={isFreeCourse}
            ctaLabel={studentCtaLabel}
          />
        </article>
      </Link>
    );
  }

  return (
    <div
      className="group h-full cursor-pointer"
      onClick={() => onView?.(course)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView?.(course);
        }
      }}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-34px_rgba(29,78,216,0.22)]">
        <CardMedia
          safeThumbnailUrl={safeThumbnailUrl}
          safeTitle={safeTitle}
          categoryLabel={categoryLabel}
          badgeLabel={badgeLabel}
          theme={theme}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />

        <div className="flex flex-1 flex-col p-6">
          <div>
            <h3 className="line-clamp-2 text-[1.16rem] font-semibold leading-7 tracking-[-0.025em] text-slate-950 sm:text-[1.22rem]">
              {safeTitle}
            </h3>
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              {displayAuthorName}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[0.92rem] text-slate-500">
              <span className="font-medium text-amber-600">★ {rating.rating}</span>
              <span className="text-slate-300">•</span>
              <span>{lessonCount} bài học</span>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p
                className={`text-[1.58rem] font-bold tracking-[-0.03em] ${
                  isFreeCourse ? "text-emerald-600" : "text-slate-950"
                }`}
              >
                {formatPriceVnd(primaryPrice)}
              </p>
              {originalPrice && originalPrice > 0 ? (
                <p className="mt-1 text-[0.82rem] font-medium text-slate-400 line-through">
                  {formatPriceVnd(originalPrice)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">{lessonCount} bài học</p>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onView?.(course);
                  }}
                  className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Xem
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit?.(course);
                  }}
                  className="inline-flex items-center rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete?.(course);
                  }}
                  disabled={deleting}
                  className="inline-flex items-center rounded-full bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function CardMedia({
  safeThumbnailUrl,
  safeTitle,
  categoryLabel,
  badgeLabel,
  theme,
  sizes,
}: {
  safeThumbnailUrl: string;
  safeTitle: string;
  categoryLabel: string;
  badgeLabel: string;
  theme: ReturnType<typeof getCourseVisualTheme>;
  sizes: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-t-[22px] bg-slate-100">
      {safeThumbnailUrl ? (
        <Image
          src={safeThumbnailUrl}
          alt={safeTitle}
          fill
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className={`relative h-full w-full overflow-hidden ${theme.panelClassName}`}
        >
          <div
            className={`absolute -left-10 top-4 h-28 w-28 rounded-full blur-3xl ${theme.glowClassName}`}
          />
          <div
            className={`absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl ${theme.glowClassName}`}
          />
          <div className="relative flex h-full items-end p-5 text-white">
            <p className="max-w-[15rem] text-xl font-semibold leading-6">
              {safeTitle}
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
        <span className="rounded-full border border-white/65 bg-white/92 px-3 py-1 text-[0.72rem] font-semibold text-slate-700 shadow-sm backdrop-blur">
          {categoryLabel}
        </span>
        {badgeLabel ? (
          <span className={getBadgeClassName(badgeLabel)}>{badgeLabel}</span>
        ) : null}
      </div>
    </div>
  );
}

function StudentCardBody({
  title,
  authorName,
  rating,
  lessonCount,
  primaryPrice,
  originalPrice,
  isFreeCourse,
  ctaLabel,
}: {
  title: string;
  authorName: string;
  rating: string;
  lessonCount: number;
  primaryPrice?: number;
  originalPrice?: number;
  isFreeCourse: boolean;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[1.16rem] font-semibold leading-7 tracking-[-0.025em] text-slate-950 sm:text-[1.22rem]">
          {title}
        </h3>
      </div>

      <p className="mt-1.5 text-sm font-medium text-slate-500">{authorName}</p>

      <div className="mt-2 flex items-center gap-2 text-[0.92rem] text-slate-500">
        <span className="font-medium text-amber-600">★ {rating}</span>
        <span className="text-slate-300">•</span>
        <span>{lessonCount} bài học</span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="min-w-0">
          <p
            className={`text-[1.58rem] font-bold tracking-[-0.03em] ${
              isFreeCourse ? "text-emerald-600" : "text-slate-950"
            }`}
          >
            {formatPriceVnd(primaryPrice)}
          </p>
          {originalPrice && originalPrice > 0 ? (
            <p className="mt-1 text-[0.82rem] font-medium text-slate-400 line-through">
              {formatPriceVnd(originalPrice)}
            </p>
          ) : null}
        </div>

        <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3.5 py-2 text-[0.82rem] font-medium text-blue-700 transition group-hover:border-blue-300 group-hover:bg-blue-100">
          {ctaLabel}
        </span>
      </div>
    </div>
  );
}

function getDisplayBadge(isFreeCourse: boolean) {
  if (isFreeCourse) {
    return "Miễn phí";
  }

  return "";
}

function getCategoryBadgeLabel(category?: string) {
  switch (category) {
    case "AI":
      return "AI Product Manager";
    case "Development":
      return "Product Manager";
    case "Business":
      return "Business Analyst";
    case "Design":
      return "UIUX";
    case "Data":
      return "AI Tools";
    default:
      return formatCourseCategory(category);
  }
}

function getBadgeClassName(label: string) {
  if (label === "Miễn phí") {
    return "rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(16,185,129,0.9)]";
  }

  return "rounded-full bg-white/94 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/5 backdrop-blur";
}
