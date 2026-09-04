import { getCurrentUserEmail } from "@/lib/current-user";
import { canAccessCourse, ensureTrackingEnrollmentForAccessibleCourse } from "@/lib/course-access";

export function isValidObjectId(value: string) {
  return Boolean(value && value.trim().length > 0);
}

export async function resolveCourseLesson(courseId: string, lessonId: string) {
  void courseId;
  void lessonId;
  throw new Error("Dữ liệu khóa học chưa được cấu hình");
}

export async function ensureCurrentUserEnrollment(courseId: string) {
  const studentEmail = await getCurrentUserEmail();

  const access = await canAccessCourse({
    courseId,
    userEmail: studentEmail,
  });

  if (!access.canAccess) {
    throw new Error("Bạn chưa được cấp quyền truy cập khóa học này.");
  }

  const enrollment =
    (await ensureTrackingEnrollmentForAccessibleCourse({
      courseId,
      userEmail: studentEmail,
    })) || {
      courseId,
      studentEmail,
      status: "active",
      progress: 0,
    };

  return { enrollment, studentEmail };
}

export async function recalculateEnrollmentProgress(studentEmail: string, courseId: string) {
  void studentEmail;
  void courseId;
  throw new Error("Dữ liệu tiến độ chưa được cấu hình");
}
