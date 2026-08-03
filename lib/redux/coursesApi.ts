import { api } from "@/lib/redux/api";
import type { ICourse } from "@/typing/Courses";
import { GetCourseParams } from "@/typing/Courses";
export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<ICourse[], GetCourseParams | void>({
      query: (params) => ({
        url: "/courses",
        method: "GET",
        params: params ?? undefined,
      }),
    }),
  }),
});

export const { useGetCoursesQuery } = coursesApi;
