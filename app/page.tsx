"use client";

import { useEffect } from "react";
import { StudentCourseCatalog } from "@/components/StudentCourseCatalog";
import type { StudentCourse } from "@/lib/course-marketplace";
import { demoCourses } from "@/lib/ui-demo-data";
import { initializeCourses } from "@/lib/features/courses/coursesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.items);

  useEffect(() => {
    dispatch(initializeCourses(demoCourses as StudentCourse[]));
  }, [dispatch]);

  return (
    <StudentCourseCatalog
      initialCourses={courses}
      initialError={null}
      layoutVariant="discover"
      pageTitle="Khám phá BrainCourse"
      pageDescription="Một không gian học tập hiện đại để tìm khóa học nổi bật, khóa học mới và bắt đầu học nhanh hơn."
      activeHref="/"
    />
  );
}
