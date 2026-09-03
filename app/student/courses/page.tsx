import { StudentCourseCatalog } from "@/components/StudentCourseCatalog";
import type { StudentCourse } from "@/typing";
import { demoCourses } from "@/lib/ui-demo-data";
import { ICourse } from "@/typing/Courses";

export default function StudentCoursesPage() {
  const courses: ICourse[] = [];

  return (
    <StudentCourseCatalog
      initialError={null}
      pageTitle="Tất cả khóa học dành cho học viên"
      pageDescription="Khám phá các khóa học public, xem chi tiết và chọn khóa học phù hợp trước khi mua hoặc bắt đầu học."
      activeHref="/student/courses"
      layoutVariant="catalog"
    />
  );
}
