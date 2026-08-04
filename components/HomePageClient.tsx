"use client";

import { StudentCourseCatalog } from "@/components/StudentCourseCatalog";
import { PageDataProvider } from "@/lib/contexts/PageDataContext";
import { ICourse } from "@/typing/Courses";

interface HomePageClientProps {
  initialCourses: ICourse[];
  lastedCourses: ICourse[];
}

export function HomePageClient(props: HomePageClientProps) {
  return (
    <PageDataProvider data={props}>
      <StudentCourseCatalog
        layoutVariant="discover"
        pageTitle="Khám phá BrainCourse"
        pageDescription="Một không gian học tập hiện đại để tìm khóa học nổi bật, khóa học mới và bắt đầu học nhanh hơn."
        activeHref="/"
      />
    </PageDataProvider>
  );
}