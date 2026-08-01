import { normalizeEmail } from "@/lib/auth";
import { demoMyCourses } from "@/lib/ui-demo-data";
import type { MyCourseItem } from "@/typing";

export type MyCoursesResult = {
  courses: MyCourseItem[];
  enrollmentCount: number;
  courseCount: number;
  missingCourseCount: number;
};

export async function getMyCoursesByEmail(
  email: string,
  options: { courseId?: string } = {},
): Promise<MyCoursesResult> {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCourseId = options.courseId?.trim() || "";

  if (!normalizedEmail) {
    return {
      courses: [],
      enrollmentCount: 0,
      courseCount: 0,
      missingCourseCount: 0,
    };
  }

  const courses = demoMyCourses
    .filter((item) => !normalizedCourseId || item.course._id === normalizedCourseId)
    .map((item) => ({
      enrollmentId: item.enrollmentId,
      progress: item.progress,
      enrolledAt: item.enrolledAt,
      completedAt: item.completedAt,
      course: {
        ...item.course,
        lessons: (item.course.lessons || []).map((lesson) => ({
          title: lesson.title || "",
          description: lesson.description || "",
          videoUrl: lesson.videoUrl || "",
          duration: lesson.duration || "",
          isFreePreview: Boolean(lesson.isFreePreview),
          order: lesson.order || 0,
        })),
      },
    }));

  return {
    courses,
    enrollmentCount: courses.length,
    courseCount: courses.length,
    missingCourseCount: 0,
  };
}
