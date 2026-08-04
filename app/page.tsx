import { HomePageClient } from "@/components/HomePageClient";
import { ICourse } from "@/typing/Courses";

export const revalidate = 300;

async function getInitialCourses(isHighlighted = true): Promise<ICourse[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses${isHighlighted ? '?highlight=1' : ''}`, {
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
  const initialCourses: ICourse[] = await getInitialCourses(true);
  const lastedCourses: ICourse[] = await getInitialCourses(false);
  return <HomePageClient initialCourses={initialCourses} lastedCourses={lastedCourses} />;
}
