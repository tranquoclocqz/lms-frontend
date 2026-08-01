"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SVGProps } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { demoCourses } from "@/lib/ui-demo-data";
import type { CourseLesson, CourseStatus, StudentCourse } from "@/typing";

type StatusFilter = "All" | CourseStatus;
type CategoryFilter =
  | "All"
  | "Development"
  | "Design"
  | "Business"
  | "Marketing"
  | "AI"
  | "Data";
type SortOrder = "Newest" | "Oldest";

type CoursesResponse = {
  success?: boolean;
  courses?: StudentCourse[];
  message?: string;
};

const COURSES_REQUEST_TIMEOUT_MS = 8000;

const statusOptions: StatusFilter[] = ["All", "Published", "Draft"];
const categoryOptions: CategoryFilter[] = [
  "All",
  "Development",
  "Design",
  "Business",
  "Marketing",
  "AI",
  "Data",
];
const sortOptions: SortOrder[] = ["Newest", "Oldest"];

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<StudentCourse[]>(demoCourses as StudentCourse[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    void fetchCourses();
  }, []);

  async function fetchCourses() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, COURSES_REQUEST_TIMEOUT_MS);

    try {
      setLoading(true);
      setError("");

      setCourses(demoCourses as StudentCourse[]);
    } catch (fetchError) {
      console.error("FETCH COURSES PAGE ERROR:", fetchError);
      setError(
        fetchError instanceof DOMException && fetchError.name === "AbortError"
          ? "Tải danh sách khóa học quá lâu. Hãy kiểm tra kết nối backend mới rồi thử lại."
          : fetchError instanceof Error
            ? fetchError.message
            : "Không thể tải danh sách khóa học",
      );
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  async function handleDeleteCourse(courseId: string) {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa khóa học này? Hành động này không thể hoàn tác.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(courseId);

      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (deleteError) {
      console.error(deleteError);
      alert(
        deleteError instanceof Error
          ? deleteError.message
          : "Không thể xóa khóa học",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredCourses = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    const nextCourses = courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || course.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    nextCourses.sort((leftCourse, rightCourse) => {
      const leftTime = new Date(leftCourse.createdAt || 0).getTime();
      const rightTime = new Date(rightCourse.createdAt || 0).getTime();

      return sortOrder === "Newest"
        ? rightTime - leftTime
        : leftTime - rightTime;
    });

    return nextCourses;
  }, [categoryFilter, courses, deferredSearch, sortOrder, statusFilter]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(
      (course) => course.status === "Published",
    ).length;
    const draftCourses = courses.filter(
      (course) => course.status !== "Published",
    ).length;
    const totalLessons = courses.reduce(
      (sum, course) => sum + (course.lessons?.length || 0),
      0,
    );

    return [
      {
        label: "Tổng khóa học",
        value: totalCourses,
        Icon: BookOpenIcon,
      },
      {
        label: "Đã xuất bản",
        value: publishedCourses,
        Icon: CheckCircleIcon,
      },
      {
        label: "Nháp",
        value: draftCourses,
        Icon: PencilSquareIcon,
      },
      {
        label: "Tổng bài học",
        value: totalLessons,
        Icon: PlayCircleIcon,
      },
    ];
  }, [courses]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-3 py-5 sm:px-5 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1360px] space-y-5">
        <section className="flex flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-white px-6 py-5 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Quản lý khóa học
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Quản lý và sắp xếp toàn bộ khóa học của bạn.
            </p>
          </div>

          <Link
            href="/courses/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tạo khóa học</span>
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(15,23,42,0.2)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {value}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,0.85fr))]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên khóa học hoặc danh mục..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <FilterSelect
              label="Trạng thái"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
              options={statusOptions}
            />
            <FilterSelect
              label="Danh mục"
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value as CategoryFilter)}
              options={categoryOptions}
            />
            <FilterSelect
              label="Sắp xếp"
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOrder)}
              options={sortOptions}
            />
          </div>
        </section>

        {loading ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CourseSkeletonCard key={index} />
            ))}
          </section>
        ) : error ? (
          <section className="rounded-[24px] border border-rose-200 bg-white p-10 text-center shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">
              Không thể tải danh sách khóa học
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => void fetchCourses()}
              className="mt-6 inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Tải lại
            </button>
          </section>
        ) : filteredCourses.length === 0 ? (
          <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-500">
              <BookOpenIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">
              Chưa có khóa học nào
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Tạo khóa học đầu tiên và bắt đầu thêm bài học.
            </p>
            <Link
              href="/courses/new"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Tạo khóa học</span>
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                mode="admin"
                deleting={deletingId === course._id}
                onView={(selectedCourse) =>
                  router.push(`/student/courses/${selectedCourse._id}`)
                }
                onEdit={(selectedCourse) =>
                  router.push(`/courses/${selectedCourse._id}/edit`)
                }
                onDelete={(selectedCourse) =>
                  void handleDeleteCourse(selectedCourse._id)
                }
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatFilterOption(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function CourseSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-video animate-pulse bg-slate-200" />
      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-8 w-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFilterOption(option: string) {
  switch (option) {
    case "All":
      return "Tất cả";
    case "Published":
      return "Đã xuất bản";
    case "Draft":
      return "Nháp";
    case "Newest":
      return "Mới nhất";
    case "Oldest":
      return "Cũ nhất";
    case "Development":
      return "Lập trình";
    case "Design":
      return "Thiết kế";
    case "Business":
      return "Kinh doanh";
    case "Marketing":
      return "Marketing";
    case "AI":
      return "AI";
    case "Data":
      return "Dữ liệu";
    case "General":
      return "Tổng quan";
    default:
      return option;
  }
}

function BookOpenIcon(props: SVGProps<SVGSVGElement>) {
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

function PlusIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
      />
    </svg>
  );
}

function PlayCircleIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m10.5 9.75 4.5 2.25-4.5 2.25v-4.5Z"
      />
    </svg>
  );
}

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M9 12.75 11.25 15 15 9.75"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function PencilSquareIcon(props: SVGProps<SVGSVGElement>) {
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
        d="m16.862 4.487 1.687-1.688a2.121 2.121 0 1 1 3 3L10.582 16.768a4.5 4.5 0 0 1-1.897 1.13L6 18.75l.852-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 7.125 16.875 4.5"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 21H4.5" />
    </svg>
  );
}

function ExclamationTriangleIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12 9v3.75m0 3.75h.008v.008H12v-.008Zm8.036 2.008L13.732 4.29c-.77-1.39-2.694-1.39-3.464 0L3.964 18.508A1.875 1.875 0 0 0 5.598 21h12.804a1.875 1.875 0 0 0 1.634-2.492Z"
      />
    </svg>
  );
}
