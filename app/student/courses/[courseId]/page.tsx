"use client";

import CourseDetailClient from "./CourseDetailClient";
import {
  useGetCourseByIdQuery,
  useGetLessonsQuery,
} from "@/lib/redux/coursesApi";
import type { ILesson, StudentCourse } from "@/typing";
import { use } from "react";

function normalizeLessons(lessons: ILesson[]) {
  return lessons.map((lesson, index) => ({
    id: lesson.id,
    title: lesson.title || "",
    description: lesson.description || "",
    videoSource: "local" as const,
    videoUrl: lesson.video_url || "",
    duration: lesson.duration_seconds ?? 0,
    isFreePreview: lesson.is_preview === 1,
    order: lesson.sort_order ?? index + 1,
    lesson_section_id: lesson.lesson_section_id,
    section: lesson.section,
  }));
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    if ("data" in error && error.data && typeof error.data === "object") {
      if ("message" in error.data && typeof error.data.message === "string") {
        return error.data.message;
      }
    }

    if ("error" in error && typeof error.error === "string") {
      return error.error;
    }
  }

  return "Không thể tải dữ liệu khóa học";
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const {
    data: courseData,
    error: courseError,
    isLoading: isCourseLoading,
  } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const {
    data: lessonsResponse,
    error: lessonsError,
    isLoading: isLessonsLoading,
  } = useGetLessonsQuery(courseId, { skip: !courseId });

  const course: StudentCourse | null = courseData
    ? {
        _id: String(courseData.id),
        title: courseData.title,
        description: courseData.description || "",
        thumbnailUrl: courseData.thumbnail_url || undefined,
        meta_data: courseData.meta_data || undefined,
        lessons: normalizeLessons(lessonsResponse?.data || []),
      }
    : null;
  const error = courseError
    ? getErrorMessage(courseError)
    : lessonsError
      ? getErrorMessage(lessonsError)
      : !isCourseLoading && !courseData
        ? "API không trả về thông tin khóa học"
        : "";

  return (
    <CourseDetailClient
      course={course}
      loading={isCourseLoading || isLessonsLoading}
      error={error}
    />
  );
}
