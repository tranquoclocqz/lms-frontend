import { api } from "@/lib/redux/api";
import type { ICourse, GetCourseParams } from "@/typing/Courses";
import type { ILesson, ILessonResponse } from "@/typing/lesson";

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseById: builder.query<ICourse, string>({
      query: (courseId) => ({
        url: `/courses/${encodeURIComponent(courseId)}`,
        method: "GET",
      }),
    }),
    getCourses: builder.query<ICourse[], GetCourseParams | void>({
      query: (params) => ({
        url: "/courses",
        method: "GET",
        params: params ?? undefined,
      }),
    }),
    getLessons: builder.query<ILessonResponse, string>({
      query: (courseId) => ({
        url: `/courses/lessons/${encodeURIComponent(courseId)}`,
        method: "GET",
      }),
      transformResponse: (lessons: ILesson[]): ILessonResponse => ({
        status: 1,
        data: lessons,
        message: "Success",
      }),
    }),
  }),
});

export const {
  useGetCourseByIdQuery,
  useGetCoursesQuery,
  useGetLessonsQuery,
} = coursesApi;
