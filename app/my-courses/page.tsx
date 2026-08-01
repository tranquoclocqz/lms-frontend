"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { StudentShell } from "@/components/StudentShell";
import { formatCourseCategory } from "@/lib/course-marketplace";
import { demoMyCourses } from "@/lib/ui-demo-data";
import type { MyCourseItem } from "@/typing";

type MyCoursesResponse = {
  success?: boolean;
  courses?: MyCourseItem[];
  message?: string;
};

async function fetchMyCourses() {
  return demoMyCourses as MyCourseItem[];
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MyCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchEnrollments() {
    try {
      setLoading(true);
      setError("");

      const nextCourses = await fetchMyCourses();
      setCourses(nextCourses);
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải khóa học của tôi",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEnrollments();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const filteredCourses = courses.filter((course) => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [
      course.course.title || "",
      course.course.shortDescription || "",
      course.course.authorName || "",
      course.course.category || "",
      formatCourseCategory(course.course.category),
    ].some((value) => value.toLowerCase().includes(query));
  });

  const activeCoursesCount = courses.filter((course) => course.progress < 100).length;
  const completedCoursesCount = courses.filter((course) => course.progress >= 100).length;
  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, course) => sum + (course.progress || 0), 0) /
            courses.length,
        )
      : 0;

  return (
    <StudentShell
      title="Khóa học của tôi"
      description="Tiếp tục học từ các khóa đã được mở quyền. Dữ liệu vẫn lấy trực tiếp từ enrollment và access logic hiện tại."
      activeHref="/my-courses"
      sidebarMode="student"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Tìm trong các khóa học của tôi...",
      }}
      actions={
        <>
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Khám phá thêm khóa học
          </Link>
          <Link
            href="/student/redeem-code"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kích hoạt mã
          </Link>
        </>
      }
      spotlight={
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
            Learning progress
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Theo dõi lộ trình học tập của bạn
          </h2>
          <p className="text-sm leading-6 text-white/80">
            Nếu dữ liệu progress thiếu hoặc chưa hoàn chỉnh, giao diện vẫn hiển
            thị fallback an toàn để không gãy flow học viên.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2 text-white">
            <MetricPill label="Đang học" value={String(activeCoursesCount)} />
            <MetricPill label="Hoàn thành" value={String(completedCoursesCount)} />
            <MetricPill label="TB tiến độ" value={`${averageProgress}%`} />
          </div>
        </div>
      }
    >
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="aspect-video animate-pulse rounded-[24px] bg-slate-200" />
              <div className="mt-5 h-6 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[32px] border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Đã xảy ra lỗi</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => void fetchEnrollments()}
            className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">
            {courses.length === 0
              ? "Bạn chưa được cấp quyền học khóa nào."
              : "Không tìm thấy khóa học phù hợp."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {courses.length === 0
              ? "Hãy đăng nhập đúng email đã được admin thêm vào danh sách học viên hoặc liên hệ admin để được cấp quyền."
              : "Thử từ khóa khác hoặc quay lại marketplace để tìm khóa học mới."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Về marketplace
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Continue learning
              </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    Danh sách khóa học đã sở hữu
                  </h2>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              {filteredCourses.length} khóa học
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => {
              const courseInfo = course.course;
              const courseId = courseInfo._id || "";
              const firstLessonHref = courseId
                ? `/learn/${courseId}/0`
                : "/student/courses";

              return (
                <CourseCard
                  key={course.enrollmentId || courseId || index}
                  course={{
                    _id: courseId,
                    title: courseInfo.title,
                    shortDescription: courseInfo.shortDescription,
                    thumbnailUrl: courseInfo.thumbnailUrl,
                    authorName: courseInfo.authorName,
                    category: courseInfo.category,
                    status: courseInfo.status,
                    lessons: courseInfo.lessons,
                  }}
                  mode="student"
                  href={firstLessonHref}
                  studentState={{
                    canLearn: true,
                    progress: course.progress || 0,
                    ctaLabel:
                      course.progress > 0 ? "Tiếp tục học" : "Bắt đầu học",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </StudentShell>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white/14 px-3 py-3 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
