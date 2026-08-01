"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";
import { demoCourses, demoEnrollments } from "@/lib/ui-demo-data";
import type {
  CourseItem,
  CreateEnrollmentPayload,
  EnrollmentItem,
  EnrollmentStats,
  EnrollmentStatus,
} from "@/typing";

type StatusFilter = "all" | EnrollmentStatus;

type EnrollmentsResponse = {
  success?: boolean;
  message?: string;
  enrollments?: EnrollmentItem[];
  stats?: EnrollmentStats;
};

type CoursesResponse = {
  success?: boolean;
  message?: string;
  courses?: CourseItem[];
};

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang học" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "paused", label: "Tạm dừng" },
];

const formStatusOptions: Array<{ value: EnrollmentStatus; label: string }> = [
  { value: "active", label: "Đang học" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "paused", label: "Tạm dừng" },
];

const emptyStats: EnrollmentStats = {
  totalStudents: 0,
  activeStudents: 0,
  completedStudents: 0,
  completionRate: 0,
};

function getStatusLabel(status: EnrollmentStatus) {
  if (status === "completed") {
    return "Đã hoàn thành";
  }

  if (status === "paused") {
    return "Tạm dừng";
  }

  return "Đang học";
}

function getCourseTitle(course: EnrollmentItem["courseId"]) {
  return typeof course === "object" ? course.title : "Khóa học BrainCourse";
}

function getCourseId(course: EnrollmentItem["courseId"]) {
  return typeof course === "object" ? course._id : course;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [courses, setCourses] = useState<CourseItem[]>(demoCourses.map((course) => ({ _id: course._id, title: course.title })));
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>(demoEnrollments as EnrollmentItem[]);
  const [stats, setStats] = useState<EnrollmentStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateEnrollmentPayload>({
    studentName: "",
    studentEmail: "",
    courseId: "",
    status: "active",
  });
  const [editForm, setEditForm] = useState<{
    status: EnrollmentStatus;
    progress: string;
  }>({
    status: "active",
    progress: "0",
  });

  const deferredSearch = useDeferredValue(search);

  async function fetchCourses() {
    try {
      setLoadingCourses(true);

      setCourses(demoCourses.map((course) => ({ _id: course._id, title: course.title })));
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải danh sách khóa học",
      );
    } finally {
      setLoadingCourses(false);
    }
  }

  async function fetchEnrollments() {
    try {
      setLoading(true);
      setError("");

      const searchParams = new URLSearchParams();
      const query = deferredSearch.trim();

      if (query) {
        searchParams.set("search", query);
      }

      if (statusFilter !== "all") {
        searchParams.set("status", statusFilter);
      }

      if (courseFilter !== "all") {
        searchParams.set("courseId", courseFilter);
      }

      setEnrollments(demoEnrollments as EnrollmentItem[]);
      setStats({
        totalStudents: demoEnrollments.length,
        activeStudents: demoEnrollments.filter((item) => item.status === "active").length,
        completedStudents: demoEnrollments.filter((item) => item.status === "completed").length,
        completionRate: demoEnrollments.length ? Math.round((demoEnrollments.filter((item) => item.status === "completed").length / demoEnrollments.length) * 100) : 0,
      });
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải danh sách học viên",
      );
      setEnrollments([]);
      setStats(emptyStats);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        await fetchCourses();
      })();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          setLoading(true);
          setError("");

          const query = deferredSearch.trim().toLowerCase();
          const nextEnrollments = (demoEnrollments as EnrollmentItem[]).filter((item) => {
            const matchesQuery =
              !query ||
              item.studentName.toLowerCase().includes(query) ||
              item.studentEmail.toLowerCase().includes(query) ||
              getCourseTitle(item.courseId).toLowerCase().includes(query);
            const matchesStatus = statusFilter === "all" || item.status === statusFilter;
            const matchesCourse = courseFilter === "all" || getCourseId(item.courseId) === courseFilter;

            return matchesQuery && matchesStatus && matchesCourse;
          });

          setEnrollments(nextEnrollments);
          setStats({
            totalStudents: nextEnrollments.length,
            activeStudents: nextEnrollments.filter((item) => item.status === "active").length,
            completedStudents: nextEnrollments.filter((item) => item.status === "completed").length,
            completionRate: nextEnrollments.length
              ? Math.round(
                  (nextEnrollments.filter((item) => item.status === "completed").length / nextEnrollments.length) * 100,
                )
              : 0,
          });
        } catch (fetchError) {
          console.error(fetchError);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Không thể tải danh sách học viên",
          );
          setEnrollments([]);
          setStats(emptyStats);
        } finally {
          setLoading(false);
        }
      })();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [courseFilter, deferredSearch, statusFilter]);

  async function handleCreateEnrollment() {
    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      const createdEnrollment: EnrollmentItem = {
        _id: `enr-${Date.now()}`,
        studentName: createForm.studentName,
        studentEmail: createForm.studentEmail,
        courseId: createForm.courseId,
        status: createForm.status,
        progress: 0,
        enrolledAt: new Date().toISOString(),
      };

      setEnrollments((prev) => [createdEnrollment, ...prev]);
      setNotice("Thêm học viên thành công");
      setIsCreateModalOpen(false);
      setCreateForm({
        studentName: "",
        studentEmail: "",
        courseId: "",
        status: "active",
      });
      await fetchEnrollments();
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể thêm học viên",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateEnrollment() {
    if (!editingEnrollment) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setNotice("");

      setEnrollments((prev) =>
        prev.map((item) =>
          item._id === editingEnrollment._id
            ? {
                ...item,
                status: editForm.status,
                progress: Number(editForm.progress),
              }
            : item,
        ),
      );
      setNotice("Cập nhật học viên thành công");
      setEditingEnrollment(null);
      await fetchEnrollments();
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể cập nhật học viên",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEnrollment(id: string) {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa học viên này khỏi khóa học không?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setNotice("");

      setEnrollments((prev) => prev.filter((item) => item._id !== id));
      setNotice("Đã xóa học viên");
      await fetchEnrollments();
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Không thể xóa học viên",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function openCreateModal() {
    setNotice("");
    setIsCreateModalOpen(true);
  }

  function openEditModal(enrollment: EnrollmentItem) {
    setNotice("");
    setEditingEnrollment(enrollment);
    setEditForm({
      status: enrollment.status,
      progress: String(enrollment.progress),
    });
  }

  const statsCards = useMemo(
    () => [
      {
        label: "Tổng học viên",
        value: stats.totalStudents.toString(),
        note: "Số enrollment phù hợp với bộ lọc hiện tại",
        Icon: UsersIcon,
      },
      {
        label: "Đang học",
        value: stats.activeStudents.toString(),
        note: "Đang theo học và chưa hoàn thành",
        Icon: SparklesIcon,
      },
      {
        label: "Đã hoàn thành",
        value: stats.completedStudents.toString(),
        note: "Đã hoàn tất khóa học",
        Icon: CheckCircleIcon,
      },
      {
        label: "Tỷ lệ hoàn thành",
        value: `${stats.completionRate}%`,
        note: "Tính trên danh sách đang hiển thị",
        Icon: ChartBarIcon,
      },
    ],
    [stats],
  );

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 opacity-95" />
            <div className="absolute -right-16 top-6 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute left-8 top-20 h-24 w-24 rounded-full bg-cyan-200/30 blur-2xl" />

            <div className="relative flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="pt-16 sm:pt-20">
                <div className="inline-flex items-center rounded-full border border-blue-200/70 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Student dashboard
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Quản lý học viên
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Theo dõi danh sách học viên, tiến độ học tập và tình trạng
                  tham gia của từng người trong hệ thống LMS.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <PlusIcon className="h-4 w-4" />
                Thêm học viên
              </button>
            </div>
          </div>
        </div>

        {notice ? (
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsCards.map(({ label, value, note, Icon }) => (
            <article
              key={label}
              className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    {loading ? "..." : value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-slate-500">{note}</p>
            </article>
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, email hoặc khóa học"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-auto">
              <label className="flex min-w-0 flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Trạng thái
                </span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-0 flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Khóa học
                </span>
                <select
                  value={courseFilter}
                  onChange={(event) => setCourseFilter(event.target.value)}
                  disabled={loadingCourses}
                  className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="all">Tất cả khóa học</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Danh sách học viên
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Đang tải dữ liệu học viên..."
                  : `${enrollments.length} học viên phù hợp với bộ lọc hiện tại.`}
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Đồng bộ từ backend mới
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 p-4 sm:p-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Chưa có học viên nào
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Dữ liệu đang được đồng bộ từ backend mới. Hãy thêm học viên
                đầu tiên hoặc điều chỉnh lại bộ lọc tìm kiếm.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1160px] text-left text-sm">
                  <thead className="bg-slate-50/80 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Học viên</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Khóa học</th>
                      <th className="px-6 py-4 font-medium">Tiến độ</th>
                      <th className="px-6 py-4 font-medium">Trạng thái</th>
                      <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                      <th className="px-6 py-4 text-right font-medium">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {enrollments.map((student) => (
                      <tr
                        key={student._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.studentName} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-950">
                                {student.studentName}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Mã: {student._id.slice(-6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-600">
                          {student.studentEmail}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {getCourseTitle(student.courseId)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex min-w-[200px] items-center gap-3">
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={student.status} />
                        </td>
                        <td className="px-6 py-5 text-slate-600">
                          {formatDate(student.enrolledAt)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(student)}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Cập nhật
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === student._id}
                              onClick={() => void handleDeleteEnrollment(student._id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <TrashIcon className="h-4 w-4" />
                              {deletingId === student._id ? "Đang xóa..." : "Xóa"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 sm:p-6 lg:hidden">
                {enrollments.map((student) => (
                  <article
                    key={student._id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={student.studentName} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">
                            {student.studentName}
                          </p>
                          <p className="truncate text-sm text-slate-500">
                            {student.studentEmail}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={student.status} />
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                      <InfoRow
                        label="Khóa học"
                        value={getCourseTitle(student.courseId)}
                      />
                      <InfoRow
                        label="Ngày tham gia"
                        value={formatDate(student.enrolledAt)}
                      />
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Tiến độ học</span>
                        <span className="font-medium text-slate-700">
                          {student.progress}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(student)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Cập nhật
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === student._id}
                        onClick={() => void handleDeleteEnrollment(student._id)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <TrashIcon className="h-4 w-4" />
                        {deletingId === student._id ? "Đang xóa..." : "Xóa"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isCreateModalOpen ? (
        <ModalShell
          title="Thêm học viên"
          description="Nhập thông tin học viên và chọn khóa học cần enroll."
          onClose={() => setIsCreateModalOpen(false)}
        >
          <div className="space-y-4">
            <InputField
              label="Tên học viên"
              value={createForm.studentName}
              onChange={(value) =>
                setCreateForm((prev) => ({ ...prev, studentName: value }))
              }
              placeholder="Ví dụ: Nguyễn Văn A"
            />
            <InputField
              label="Email học viên"
              type="email"
              value={createForm.studentEmail}
              onChange={(value) =>
                setCreateForm((prev) => ({ ...prev, studentEmail: value }))
              }
              placeholder="student@example.com"
            />
            <SelectField
              label="Khóa học"
              value={createForm.courseId}
              onChange={(value) =>
                setCreateForm((prev) => ({ ...prev, courseId: value }))
              }
              disabled={loadingCourses}
              options={[
                { value: "", label: loadingCourses ? "Đang tải khóa học..." : "Chọn khóa học" },
                ...courses.map((course) => ({
                  value: course._id,
                  label: course.title,
                })),
              ]}
            />
            <SelectField
              label="Trạng thái"
              value={createForm.status}
              onChange={(value) =>
                setCreateForm((prev) => ({
                  ...prev,
                  status: value as EnrollmentStatus,
                }))
              }
              options={formStatusOptions.map((status) => ({
                value: status.value,
                label: status.label,
              }))}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleCreateEnrollment()}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Đang lưu..." : "Thêm học viên"}
            </button>
          </div>
        </ModalShell>
      ) : null}

      {editingEnrollment ? (
        <ModalShell
          title="Cập nhật học viên"
          description="Chỉnh sửa trạng thái và tiến độ học tập của học viên."
          onClose={() => setEditingEnrollment(null)}
        >
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="font-semibold text-slate-950">
              {editingEnrollment.studentName}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {editingEnrollment.studentEmail}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Khóa học: {getCourseTitle(editingEnrollment.courseId)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Mã khóa học: {getCourseId(editingEnrollment.courseId)}
            </p>
          </div>

          <div className="mt-4 space-y-4">
            <SelectField
              label="Trạng thái"
              value={editForm.status}
              onChange={(value) =>
                setEditForm((prev) => ({
                  ...prev,
                  status: value as EnrollmentStatus,
                }))
              }
              options={formStatusOptions.map((status) => ({
                value: status.value,
                label: status.label,
              }))}
            />
            <InputField
              label="Tiến độ"
              type="number"
              value={editForm.progress}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, progress: value }))
              }
              placeholder="0 - 100"
              min={0}
              max={100}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setEditingEnrollment(null)}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleUpdateEnrollment()}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </ModalShell>
      ) : null}
    </section>
  );
}

function ModalShell({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-8">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "H";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-sm font-semibold text-white shadow-sm shadow-blue-100">
      {initial}
    </div>
  );
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const className =
    status === "completed"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "paused"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-blue-50 text-blue-700 ring-blue-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v14M5 12h14"
      />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m21 21-4.35-4.35"
      />
      <circle cx="11" cy="11" r="6.5" strokeWidth={1.8} />
    </svg>
  );
}

function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m16.862 4.487 2.651 2.651M7.5 20.25H4.5v-3l9.814-9.814a1.875 1.875 0 0 1 2.652 0l.598.598a1.875 1.875 0 0 1 0 2.652L7.5 20.25Z"
      />
    </svg>
  );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M6 7.5h12M9.75 7.5V6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v1.5m-7.5 0v9.75A1.5 1.5 0 0 0 8.25 18.75h7.5a1.5 1.5 0 0 0 1.5-1.5V7.5"
      />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M6 6 18 18M18 6 6 18"
      />
    </svg>
  );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
      />
      <circle cx="9.5" cy="7" r="3" strokeWidth={1.8} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M20 21v-2a4 4 0 0 0-3-3.87M16.5 4.13a3 3 0 0 1 0 5.74"
      />
    </svg>
  );
}

function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m12 3 1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m19 14 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5ZM5 14l.8 1.7L7.5 16l-1.7.8L5 18.5l-.8-1.7L2.5 16l1.7-.3L5 14Z"
      />
    </svg>
  );
}

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m8.5 12.5 2.3 2.3 4.7-5.3"
      />
    </svg>
  );
}

function ChartBarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 20h16"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M7 16v-5M12 16V8m5 8V5"
      />
    </svg>
  );
}
