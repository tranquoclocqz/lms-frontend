import type { StudentCourse } from "@/typing";

type GetCoursesOptions = {
  publishedOnly?: boolean;
  limit?: number;
};

export function getFriendlyCourseErrorMessage() {
  return "Không thể tải dữ liệu khóa học lúc này.";
}

export async function getCourses(
  options: GetCoursesOptions = {},
): Promise<StudentCourse[]> {
  const { publishedOnly = false, limit } = options;
  void publishedOnly;
  void limit;
  return [];
}

export async function getCourseById(courseId: string) {
  void courseId;
  return null;
}
