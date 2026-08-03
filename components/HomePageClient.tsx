"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StudentCourseCatalog } from "@/components/StudentCourseCatalog";
import { AppDispatch } from "@/lib/store";
import { coursesApi, useGetCoursesQuery } from "@/lib/redux/coursesApi";
import { ICourse } from "@/typing/Courses";

export function HomePageClient({
  initialCourses,
}: { initialCourses: ICourse[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const hasInitialCourses = initialCourses?.length > 0;

  // 1. Nạp dữ liệu từ Server vào Redux Cache ngay lập tức
  useEffect(() => {
    if (hasInitialCourses) {
      dispatch(
        coursesApi.util.upsertQueryData("getCourses", { highlight: 1 }, initialCourses)
      );
    }

  }, [dispatch, hasInitialCourses, initialCourses]);

  // Chỉ gọi API khi server không cung cấp dữ liệu ban đầu.
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCoursesQuery(
    hasInitialCourses ? skipToken : { highlight: 1 },
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const courses = hasInitialCourses ? initialCourses : (data ?? []);

  return <StudentCourseCatalog
    initialCourses={courses}
    initialError={isError ? "Không thể tải danh sách khóa học từ API." : null}
    isRefreshing={isLoading || isFetching}
    onRetry={hasInitialCourses ? undefined : () => {
      void refetch();
    }}
    layoutVariant="discover"
    pageTitle="Khám phá BrainCourse"
    pageDescription="Một không gian học tập hiện đại để tìm khóa học nổi bật, khóa học mới và bắt đầu học nhanh hơn."
    activeHref="/"
  />
}