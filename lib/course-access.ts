import { normalizeEmail } from "@/lib/auth";

type AccessArgs = {
  courseId: string;
  userEmail?: string | null;
};

export function isCourseFree(course?: {
  price?: number;
  discountPrice?: number;
  originalPrice?: number;
}) {
  if (!course) {
    return false;
  }

  const price = Number(course.price ?? 0);
  const discountPrice = Number(course.discountPrice ?? price);

  return (
    (!Number.isFinite(price) || price <= 0) ||
    (!Number.isFinite(discountPrice) || discountPrice <= 0)
  );
}

export async function canAccessCourse({ courseId, userEmail }: AccessArgs) {
  void courseId;
  void userEmail;
  const course = null;

  return {
    canAccess: false,
    reason: "not_found" as const,
    course,
    enrollment: null,
    paidOrder: null,
  };
}

export async function ensureTrackingEnrollmentForAccessibleCourse({
  courseId,
  userEmail,
}: AccessArgs) {
  const access = await canAccessCourse({ courseId, userEmail });

  if (!access.canAccess || !access.course || !normalizeEmail(userEmail)) {
    return access.enrollment || null;
  }

  return access.enrollment || null;
}
