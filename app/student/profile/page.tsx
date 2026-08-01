import Link from "next/link";
import { StudentShell } from "@/components/StudentShell";

export default function StudentProfilePage() {
  return (
    <StudentShell
      title="Cài đặt học viên"
      description="Không thay đổi schema hay hồ sơ dữ liệu. Trang này hiện đóng vai trò khu vực thiết lập và điều hướng cho học viên."
      activeHref="/student/profile"
      sidebarMode="student"
      actions={
        <>
          <Link
            href="/my-courses"
            className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Quay lại khóa học của tôi
          </Link>
          <Link
            href="/student/redeem-code"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kích hoạt mã học
          </Link>
        </>
      }
    >
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <article className="rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Hồ sơ học viên
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Khu vực hồ sơ và thiết lập
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Dự án hiện chưa có module chỉnh sửa hồ sơ riêng cho học viên, nên
            phần này được giữ gọn như một settings hub để không phá logic sẵn có.
          </p>
        </article>

        <article className="rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Tác vụ nhanh
          </p>
          <div className="mt-4 space-y-3">
            <Link
              href="/my-courses"
              className="block rounded-[20px] border border-slate-200 px-5 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Đi tới khóa học của tôi
            </Link>
            <Link
              href="/"
              className="block rounded-[20px] border border-slate-200 px-5 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Khám phá marketplace
            </Link>
          </div>
        </article>
      </section>
    </StudentShell>
  );
}
