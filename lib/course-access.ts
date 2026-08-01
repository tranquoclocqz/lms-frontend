import { normalizeEmail, isTeacherOrAdmin } from "@/lib/auth";
import { getDemoCourseById } from "@/lib/ui-demo-data";

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
  const normalizedEmail = normalizeEmail(userEmail);
  const course = getDemoCourseById(courseId);

  if (!course) {
    return {
      canAccess: false,
      reason: "not_found" as const,
      course: null,
      enrollment: null,
      paidOrder: null,
    };
  }

  if (isTeacherOrAdmin(normalizedEmail)) {
    return {
      canAccess: true,
      reason: "teacher" as const,
      course,
      enrollment: null,
      paidOrder: null,
    };
  }

  if (isCourseFree(course)) {
    return {
      canAccess: true,
      reason: "free_course" as const,
      course,
      enrollment: null,
      paidOrder: null,
    };
  }

  if (!normalizedEmail) {
    return {
      canAccess: false,
      reason: "unauthenticated" as const,
      course,
      enrollment: null,
      paidOrder: null,
    };
  }

  return {
    canAccess: true,
    reason: "enrollment" as const,
    course,
    enrollment: {
      courseId,
      studentEmail: normalizedEmail,
      status: "active",
      progress: 0,
    },
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

  if (access.reason === "teacher") {
    return null;
  }

  return access.enrollment || null;
}
