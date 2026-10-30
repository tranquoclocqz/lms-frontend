import { StudentCourseCatalog } from "@/components/StudentCourseCatalog";
import { PageDataProvider } from "@/lib/contexts/PageDataContext";

export default function StudentCoursesPage() {
  return (
    <PageDataProvider data={{ initialCourses: [], lastedCourses: [] }}>
      <StudentCourseCatalog
        initialError={null}
        pageTitle="Tất cả khóa học dành cho học viên"
        pageDescription="Khám phá các khóa học public, xem chi tiết và chọn khóa học phù hợp trước khi mua hoặc bắt đầu học."
        activeHref="/student/courses"
        layoutVariant="catalog"
      />
    </PageDataProvider>
  );
}
