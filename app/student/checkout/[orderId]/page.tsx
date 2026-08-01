"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { getDemoCourseById } from "@/lib/ui-demo-data";
import type { CheckoutResponse } from "@/typing";

type CheckoutPageProps = {
  params: Promise<{ orderId: string }>;
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderId } = use(params);
  const router = useRouter();
  const [data, setData] = useState<CheckoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">("info");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let mounted = true;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    function stopPolling() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }

    function getRedirectUrl(result: CheckoutResponse) {
      const resolvedCourseId = result.order?.courseId || result.courseId || "";
      const resolvedFirstLessonId =
        result.order?.firstLessonId || result.firstLessonId || "";

      if (!resolvedCourseId) {
        return "/student/courses";
      }

      if (resolvedFirstLessonId) {
        return `/learn/${resolvedCourseId}/${resolvedFirstLessonId}`;
      }

      return `/student/courses/${resolvedCourseId}`;
    }

    async function fetchOrder(options?: { silent?: boolean }) {
      try {
        if (!options?.silent) {
          setLoading(true);
          setError("");
        }

        const demoCourse = getDemoCourseById("course-1");
        const result: CheckoutResponse = {
          success: true,
          order: {
            id: orderId,
            courseId: demoCourse?._id || "course-1",
            amount: 1290000,
            transferContent: `PAY${orderId}`,
            status: "paid",
            firstLessonId: "0",
            course: {
              title: demoCourse?.title || "Khóa học demo",
              thumbnailUrl: demoCourse?.thumbnailUrl,
            },
          },
        };

        if (mounted) {
          setData(result);
          setStatusTone("success");
          setStatusMessage("Thanh toán thành công. Đang chuyển vào khóa học...");
          setIsRedirecting(true);

          if (!redirectTimer) {
            redirectTimer = setTimeout(() => {
              router.push(getRedirectUrl(result));
            }, 800);
          }
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (mounted) {
          setError("Không thể tải đơn hàng");
          stopPolling();
        }
      } finally {
        if (mounted && !options?.silent) {
          setLoading(false);
        }
      }
    }

    void fetchOrder();

    return () => {
      mounted = false;
      stopPolling();
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(186,230,253,0.35),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_48%,_#f0f7ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-40 rounded-[30px] bg-white shadow-sm" />
          <div className="h-[32rem] rounded-[30px] bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(186,230,253,0.35),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_48%,_#f0f7ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-rose-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">
            Không thể tải đơn hàng
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {error || "Đơn hàng không tồn tại hoặc đã bị xóa."}
          </p>
          <Link
            href="/student/courses"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-600"
          >
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  const { order, bank, qrUrl } = data;
  const transferContent = order.transferContent || "Hoc vien Ck";
  const formattedAmount = `${new Intl.NumberFormat("vi-VN").format(order.amount)} VND`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(147,197,253,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(186,230,253,0.35),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_48%,_#f0f7ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {statusMessage ? (
          <div
            className={`rounded-[24px] border px-5 py-4 text-sm font-medium shadow-sm ${
              statusTone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : statusTone === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {statusMessage}
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-[0_22px_70px_-42px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 sm:h-28 sm:w-28">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.06),transparent_65%)]" />
                {order.course.thumbnailUrl ? (
                  <Image
                    src={order.course.thumbnailUrl}
                    alt={order.course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#2563eb_100%)] text-3xl font-semibold text-white">
                    {order.course.title.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Thanh toán khóa học
                </p>
                <h1 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  {order.course.title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {isRedirecting
                    ? "Hệ thống đã xác nhận thanh toán và đang chuyển bạn vào khóa học."
                    : "Quét mã QR hoặc dùng thông tin thanh toán bên dưới để chuyển khoản nhanh chóng."}
                </p>
              </div>
            </div>

            <div className="lg:min-w-[240px] lg:text-right">
              <p className="text-3xl font-semibold tracking-tight text-blue-700 sm:text-[2rem]">
                {formattedAmount}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200/70 bg-white p-5 shadow-[0_22px_70px_-42px_rgba(15,23,42,0.18)] sm:p-6 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-sm">
                {qrUrl ? (
                  <Image
                    src={qrUrl}
                    alt="QR thanh toán"
                    width={440}
                    height={440}
                    className="h-auto w-full"
                    unoptimized
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center p-8 text-center text-sm text-slate-500">
                    Chưa có QR khả dụng.
                  </div>
                )}
              </div>

              <div className="rounded-[22px] border border-blue-100 bg-blue-50/70 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong vòng 1-3 phút. Vui lòng giữ nguyên nội dung chuyển khoản.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.14)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Thông tin thanh toán
              </p>

              <div className="mt-5 rounded-[24px] bg-white/80 p-4 ring-1 ring-slate-200/70 backdrop-blur-sm sm:p-5">
                <PaymentRow
                  icon={<BankIcon className="h-4 w-4" />}
                  label="Ngân hàng"
                  value={bank?.bankName || "Sacombank (STB)"}
                />
                <PaymentRow
                  icon={<CardIcon className="h-4 w-4" />}
                  label="Số tài khoản"
                  value={bank?.bankAccount || "060339723145"}
                />
                <PaymentRow
                  icon={<UserIcon className="h-4 w-4" />}
                  label="Chủ tài khoản"
                  value={bank?.accountName || "LE THI NGOC MAI"}
                />
                <PaymentRow
                  icon={<NoteIcon className="h-4 w-4" />}
                  label="Nội dung chuyển khoản"
                  value={transferContent}
                />
                <PaymentRow
                  icon={<MoneyIcon className="h-4 w-4" />}
                  label="Số tiền"
                  value={formattedAmount}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PaymentRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200/80 py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-slate-950 sm:text-[15px]">
          {value}
        </p>
      </div>
    </div>
  );
}

function BankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 9 8.25-4.5L20.25 9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5h15M6.75 10.5v6.75m3-6.75v6.75m3-6.75v6.75m3-6.75v6.75M3.75 19.5h16.5" />
    </svg>
  );
}

function CardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.75" y="5.25" width="16.5" height="13.5" rx="2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5" />
    </svg>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm-6.75 7.5a6.75 6.75 0 0 1 13.5 0" />
    </svg>
  );
}

function NoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h7.94a2.25 2.25 0 0 1 1.59.66l2.31 2.31a2.25 2.25 0 0 1 .66 1.59v9.94A2.25 2.25 0 0 1 17 20.25H6.75A2.25 2.25 0 0 1 4.5 18V6A2.25 2.25 0 0 1 6.75 3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h7.5M8.25 13.5h7.5" />
    </svg>
  );
}

function MoneyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.75" y="6" width="16.5" height="12" rx="2.25" />
      <circle cx="12" cy="12" r="2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9h.008v.008H7.5V9Zm9 6h.008v.008H16.5V15Z" />
    </svg>
  );
}
