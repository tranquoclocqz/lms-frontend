import CourseDetailClient from "./CourseDetailClient";
import type {
  CourseDetailResponse,
  CourseLessonsResponse,
  ILesson,
  StudentCourse,
} from "@/typing";

export const revalidate = 60;

function normalizeLessons(lessons: ILesson[]) {
  return lessons.map((lesson, index) => ({
    id: lesson.id,
    title: lesson.title || "",
    description: lesson.description || "",
    videoSource: "local" as const,
    videoUrl: lesson.video_url || "",
    duration: (lesson.duration_seconds ?? 0),
    isFreePreview: lesson.is_preview === 1,
    order: lesson.sort_order ?? index + 1,
  }));
}

function getApiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("Thiếu biến môi trường NEXT_PUBLIC_API_URL");
  }

  return `${baseUrl}/${path}`;
}

async function getCourseWithLessons(courseId: string) {
  const encodedCourseId = encodeURIComponent(courseId);

  try {
    const requestInit: RequestInit = {
      headers: { Accept: "application/json" },
      next: { revalidate },
    };
    const [courseResponse, lessonsResponse] = await Promise.all([
      fetch(getApiUrl(`courses/${encodedCourseId}`), requestInit),
      fetch(getApiUrl(`courses/lessons/${encodedCourseId}`), requestInit),
    ]);

    if (!courseResponse.ok || !lessonsResponse.ok) {
      throw new Error(
        `Course API trả về HTTP ${courseResponse.status}; lesson API trả về HTTP ${lessonsResponse.status}`,
      );
    }

    const coursePayload = (await courseResponse.json()) as CourseDetailResponse;
    const lessonsPayload = (await lessonsResponse.json()) as CourseLessonsResponse;

    if (
      !coursePayload.data ||
      coursePayload.status !== 1 ||
      lessonsPayload.status !== 1
    ) {
      throw new Error(
        coursePayload.message ||
          lessonsPayload.message ||
          "API trả về dữ liệu không hợp lệ",
      );
    }

    return {
      course: {
        _id: String(coursePayload.data.id),
        title: coursePayload.data.title,
        description: coursePayload.data.description || "",
        thumbnailUrl: coursePayload.data.thumbnail_url || undefined,
        meta_data: coursePayload.data.meta_data || undefined,
        lessons: normalizeLessons(lessonsPayload.data || []),
      } satisfies StudentCourse,
      error: "",
    };
  } catch (fetchError) {
    console.error("Không thể tải chi tiết khóa học:", fetchError);

    return {
      course: null,
      error:
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải khóa học",
    };
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { course, error } = await getCourseWithLessons(courseId);

  return (
    <CourseDetailClient
      params={params}
      initialCourse={course}
      initialError={error}
    />
  );
}
