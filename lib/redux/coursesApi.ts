import { api } from "@/lib/redux/api";
import type { ICourse, GetCourseParams } from "@/typing/Courses";
import type { ILesson, ILessonResponse } from "@/typing/lesson";

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<ICourse[], GetCourseParams | void>({
      query: (params) => ({
        url: "/courses",
        method: "GET",
        params: params ?? undefined,
      }),
    }),
    getLesson: builder.query<ILessonResponse, string>({
      query: (lessonId) => ({
        url: `/lessons/${encodeURIComponent(lessonId)}`,
        method: "GET",
      }),
      transformResponse: (lesson: ILesson): ILessonResponse => ({
        success: true,
        data: lesson,
      }),
    }),
  }),
});

export const { useGetCoursesQuery, useGetLessonQuery } = coursesApi;
