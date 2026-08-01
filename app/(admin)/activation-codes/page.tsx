"use client";

import { useEffect, useState } from "react";
import { demoActivationCodes, demoCourses } from "@/lib/ui-demo-data";
import type { ActivationCodeItem, ActivationCodeCourse } from "@/typing";

type CoursesResponse = {
  success?: boolean;
  courses?: ActivationCodeCourse[];
  message?: string;
};

type ActivationCodesResponse = {
  success?: boolean;
  activationCodes?: ActivationCodeItem[];
  message?: string;
};

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export default function ActivationCodesPage() {
  const [courses, setCourses] = useState<ActivationCodeCourse[]>(demoCourses.map((course) => ({ _id: course._id, title: course.title, status: course.status })));
  const [activationCodes, setActivationCodes] = useState<ActivationCodeItem[]>(
    demoActivationCodes as ActivationCodeItem[],
  );
  const [courseId, setCourseId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function fetchCourses() {
    const nextCourses = demoCourses.map((course) => ({ _id: course._id, title: course.title, status: course.status }));
    setCourses(nextCourses);

    if (!courseId && nextCourses.length > 0) {
      setCourseId(nextCourses[0]._id);
    }
  }

  async function fetchActivationCodes() {
    setActivationCodes(demoActivationCodes as ActivationCodeItem[]);
  }

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchCourses(), fetchActivationCodes()]);
    } catch (loadError) {
      console.error(loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải dữ liệu mã kích hoạt",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPageData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  async function handleCreateCodes() {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const nextCode = {
        _id: `code-${Date.now()}`,
        code: `BRAIN-${String(Date.now()).slice(-4)}`,
        courseId,
        isUsed: false,
        usedBy: null,
        usedAt: null,
        createdAt: new Date().toISOString(),
      } as ActivationCodeItem;

      setActivationCodes((current) => [nextCode, ...current]);
      setMessage(`Đã tạo 1 mã kích hoạt mới cho khóa học này.`);
      await fetchActivationCodes();
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể tạo mã kích hoạt",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Mã kích hoạt khóa học
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Tạo hàng loạt mã kích hoạt và theo dõi tình trạng sử dụng theo từng
            khóa học.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Tạo mã mới</h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Khóa học
                </span>
                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className={inputClassName}
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Số lượng mã
                </span>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className={inputClassName}
                  placeholder="Nhập số lượng mã muốn tạo"
                />
              </label>

              <button
                type="button"
                onClick={() => void handleCreateCodes()}
                disabled={submitting || !courseId}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? "Đang tạo mã..." : "Tạo mã"}
              </button>

              {message ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Danh sách mã
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {activationCodes.length} mã kích hoạt đã tạo
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadPageData()}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Tải lại
              </button>
            </div>

            {loading ? (
              <div className="mt-5 space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : activationCodes.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                Chưa có mã kích hoạt nào.
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-slate-500">
                        <th className="px-4 py-3 font-medium">Mã</th>
                        <th className="px-4 py-3 font-medium">Khóa học</th>
                        <th className="px-4 py-3 font-medium">Trạng thái</th>
                        <th className="px-4 py-3 font-medium">Người dùng</th>
                        <th className="px-4 py-3 font-medium">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activationCodes.map((activationCode) => {
                        const course =
                          typeof activationCode.courseId === "object"
                            ? activationCode.courseId
                            : null;

                        return (
                          <tr key={activationCode._id}>
                            <td className="px-4 py-3 font-semibold tracking-[0.16em] text-slate-900">
                              {activationCode.code}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                              {course?.title || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  activationCode.isUsed
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {activationCode.isUsed ? "Đã dùng" : "Chưa dùng"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {activationCode.usedBy || "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {activationCode.createdAt
                                ? new Date(
                                    activationCode.createdAt,
                                  ).toLocaleString("vi-VN")
                                : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
