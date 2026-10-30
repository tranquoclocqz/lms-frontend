"use client";

import { StudentCourseCatalog } from "@/components/StudentCourseCatalog";
import { PageDataProvider } from "@/lib/contexts/PageDataContext";
import { useGetCoursesQuery } from "@/lib/redux/coursesApi";

function getCoursesErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;

    if (data && typeof data === "object" && "message" in data) {
      return String(data.message);
    }
  }

  if (error && typeof error === "object" && "error" in error) {
    return String(error.error);
  }

  return "Không thể tải danh sách khóa học. Vui lòng thử lại.";
}

export function HomePageClient() {
  const { data: initialCourses = [], error } = useGetCoursesQuery();
  const props = { initialCourses, lastedCourses: [] };

  return (
    <PageDataProvider data={props}>
      <StudentCourseCatalog
        initialError={error ? getCoursesErrorMessage(error) : null}
        layoutVariant="discover"
        pageTitle="Khám phá BrainCourse"
        pageDescription="Một không gian học tập hiện đại để tìm khóa học nổi bật, khóa học mới và bắt đầu học nhanh hơn."
        activeHref="/"
      />
    </PageDataProvider>
  );
}