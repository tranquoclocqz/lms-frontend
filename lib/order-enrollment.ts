import { calculateEnrollmentProgress, deriveStudentName, normalizeStudentEmail } from "@/lib/enrollment-utils";

type OrderLike = {
  _id: string;
  courseId: string;
  userId?: string | null;
  studentName?: string | null;
  studentEmail?: string | null;
};

export async function ensureEnrollmentForPaidOrder(order: OrderLike) {
  const studentEmail = normalizeStudentEmail(order.studentEmail || "");

  if (!studentEmail) {
    throw new Error("Đơn hàng thiếu email học viên để tạo enrollment");
  }

  const payload = {
    courseId: order.courseId,
    userId: order.userId || null,
    studentName: deriveStudentName(order.studentName),
    studentEmail,
    orderId: order._id,
    status: "active",
    progress: calculateEnrollmentProgress(0, "active"),
    enrolledAt: new Date().toISOString(),
  };

  return {
    success: true,
    enrollment: {
      ...payload,
      _id: `demo-${order._id}`,
    },
  };
}
