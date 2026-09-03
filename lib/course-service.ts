import type { StudentCourse } from "@/typing";
import { demoCourses, getDemoCourseById } from "@/lib/ui-demo-data";

type GetCoursesOptions = {
  publishedOnly?: boolean;
  limit?: number;
};

function normalizeLesson(lesson: {
  title?: string;
  description?: string;
  videoSource?: "local" | "bunny" | string;
  videoUrl?: string;
  duration?: string;
  isFreePreview?: boolean;
  order?: number;
}) {
  return {
    title: lesson.title || "",
    description: lesson.description || "",
    videoSource:
      lesson.videoSource === "bunny"
        ? ("bunny" as const)
        : ("local" as const),
    videoUrl: lesson.videoUrl || "",
    duration: lesson.duration || "",
    isFreePreview: Boolean(lesson.isFreePreview),
    order: lesson.order || 0,
  };
}

export function getFriendlyCourseErrorMessage() {
  return "Không thể tải dữ liệu khóa học lúc này. Chế độ giao diện đang dùng dữ liệu mẫu.";
}

function normalizeCourse(course: StudentCourse): StudentCourse {
  return {
    ...course,
    lessons: (course.lessons || []).map(normalizeLesson),
    createdAt: course.createdAt
      ? new Date(course.createdAt).toISOString()
      : undefined,
  };
}

export async function getCourses(
  options: GetCoursesOptions = {},
): Promise<StudentCourse[]> {
  const { publishedOnly = false, limit } = options;
  const courses = demoCourses.filter((course) => !publishedOnly || course.status === "Published");
  const visible = typeof limit === "number" ? courses.slice(0, limit) : courses;

  return visible.map((course) => normalizeCourse(course));
}

export async function getCourseById(courseId: string) {
  const course = getDemoCourseById(courseId);
  return course ? normalizeCourse(course) : null;
}
