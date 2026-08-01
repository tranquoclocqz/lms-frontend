"use client";

import Link from "next/link";
import { useState } from "react";
import { StudentShell } from "@/components/StudentShell";
import type { RedeemResponse } from "@/typing";

export default function StudentRedeemCodePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [courseLink, setCourseLink] = useState("");
  const [firstLessonLink, setFirstLessonLink] = useState("");

  async function handleRedeemCode() {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setCourseLink("");
      setFirstLessonLink("");

      if (!code.trim()) {
        throw new Error("Vui lòng nhập mã kích hoạt");
      }

      const demoCourseLink = "/student/courses/course-1";
      const demoLessonLink = "/learn/course-1/0";

      setSuccessMessage("Kích hoạt mã thành công, khóa học đã được mở khóa.");
      setCourseLink(demoCourseLink);
      setFirstLessonLink(demoLessonLink);
      setCode("");
    } catch (redeemError) {
      console.error(redeemError);
      setError(
        redeemError instanceof Error
          ? redeemError.message
          : "Không thể kích hoạt mã",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <StudentShell
      title="Kích hoạt khóa học bằng mã"
      description="Luồng kích hoạt mã được giữ nguyên. Phần thay đổi ở đây chỉ là UI và bố cục theo dashboard học viên."
      activeHref="/student/profile"
      sidebarMode="student"
      actions={
        <Link
          href="/my-courses"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Quay lại khóa học của tôi
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-[36px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.22)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
                Redeem Course
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Kích hoạt khóa học bằng mã
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Nhập mã kích hoạt do giảng viên hoặc admin cung cấp để mở khóa
                học ngay lập tức cho tài khoản hiện tại.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Mã kích hoạt
              </span>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="Ví dụ: ABCD-1234-EFGH"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase tracking-[0.16em] text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </label>

            <button
              type="button"
              onClick={() => void handleRedeemCode()}
              disabled={loading || !code.trim()}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Đang kích hoạt..." : "Kích hoạt khóa học"}
            </button>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <p>{successMessage}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {courseLink ? (
                    <Link
                      href={courseLink}
                      className="inline-flex rounded-full bg-white px-4 py-2 font-medium text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Xem khóa học
                    </Link>
                  ) : null}
                  {firstLessonLink ? (
                    <Link
                      href={firstLessonLink}
                      className="inline-flex rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
                    >
                      Vào học ngay
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
