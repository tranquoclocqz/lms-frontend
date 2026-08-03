import { HomePageClient } from "@/components/HomePageClient";
import { ICourse } from "@/typing/Courses";

export const revalidate = 300;

async function getInitialCourses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses?highlight=1`, {
      next: { revalidate },
    });
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Lỗi fetch khóa học từ Server:", error);
    return [];
  }
}

export default async function HomePage() {
  const initialCourses: ICourse[] = await getInitialCourses();
  return <HomePageClient initialCourses={initialCourses} />;
}
