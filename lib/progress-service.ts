import { getCurrentUserEmail } from "@/lib/current-user";
import { canAccessCourse, ensureTrackingEnrollmentForAccessibleCourse } from "@/lib/course-access";
import { resolveLessonIndex } from "@/lib/course-lessons";
import { getDemoCourseById } from "@/lib/ui-demo-data";

export function isValidObjectId(value: string) {
  return Boolean(value && value.trim().length > 0);
}

export async function resolveCourseLesson(courseId: string, lessonId: string) {
  const course = getDemoCourseById(courseId);

  if (!course) {
    throw new Error("Không tìm thấy khóa học");
  }

  const lessons = course.lessons || [];
  const lessonIndex = resolveLessonIndex(lessons, lessonId);
  const lesson = lessonIndex >= 0 ? lessons[lessonIndex] : null;

  if (!lesson) {
    throw new Error("Không tìm thấy bài học");
  }

  return {
    course,
    canonicalLessonId: String(lesson.order ?? lessonIndex),
    totalLessons: lessons.length,
  };
}

export async function ensureCurrentUserEnrollment(courseId: string) {
  const studentEmail = (await getCurrentUserEmail()) || "demo@braincourse.dev";

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
  const course = getDemoCourseById(courseId);
  const totalLessons = course?.lessons?.length || 0;
  const completedLessons = 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    progress,
    totalLessons,
    completedLessons,
    enrollmentId: `demo-${courseId}`,
    status: progress >= 100 ? "completed" : "active",
  };
}
