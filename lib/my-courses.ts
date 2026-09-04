import { normalizeEmail } from "@/lib/auth";
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

  void normalizedCourseId;
  const courses: MyCourseItem[] = [];

  return {
    courses,
    enrollmentCount: courses.length,
    courseCount: courses.length,
    missingCourseCount: 0,
  };
}
