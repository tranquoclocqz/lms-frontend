import Link from "next/link";
import { demoDashboardStats } from "@/lib/ui-demo-data";

const quickLinks = [
  {
    href: "/courses",
    title: "Quản lý khóa học",
    description: "Xem, chỉnh sửa và tổ chức toàn bộ khóa học đang có.",
  },
  {
    href: "/courses/new",
    title: "Tạo khóa học",
    description: "Mở nhanh biểu mẫu để tạo một khóa học mới.",
  },
  {
    href: "/students",
    title: "Quản lý học viên",
    description: "Theo dõi enrollment, tiến độ học tập và quyền truy cập.",
  },
  {
    href: "/orders",
    title: "Đơn hàng",
    description: "Kiểm tra thanh toán, webhook và lịch sử giao dịch của hệ thống.",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminDashboardPage() {
  const statsPayload = demoDashboardStats;
  const totalStudents = statsPayload.totalStudents ?? 0;
  const activeStudents = statsPayload.activeStudents ?? 0;
  const totalOrders = statsPayload.totalOrders ?? 0;
  const totalCourses = statsPayload.totalCourses ?? 0;
  const totalRevenue = statsPayload.totalRevenue ?? 0;
  const stats = [
    {
      label: "Tổng học viên",
      value: totalStudents.toString(),
      note: "Số enrollment hiện có trong hệ thống",
    },
    {
      label: "Tổng đơn hàng",
      value: totalOrders.toString(),
      note: "Bao gồm đơn chờ thanh toán và đã thanh toán",
    },
    {
      label: "Doanh thu",
      value: formatCurrency(totalRevenue),
      note: "Chỉ tính các đơn hàng đã thanh toán thành công",
    },
    {
      label: "Học viên đang học",
      value: activeStudents.toString(),
      note: "Enrollment đang ở trạng thái active",
    },
    {
      label: "Số khóa học",
      value: totalCourses.toString(),
      note: "Toàn bộ khóa học đã tạo trong hệ thống",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Bảng điều khiển giảng viên
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Dữ liệu tổng quan đang được giữ ở chế độ demo để minh họa giao diện
            quản trị và luồng học viên của BrainCourse LMS.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {item.value}
              </p>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                {item.note}
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
