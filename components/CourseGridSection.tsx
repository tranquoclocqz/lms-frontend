import type { ICourse } from "@/typing/Courses";
import type { StudentCourse } from "@/typing";
import { CourseCard } from "./CourseCard";

export default function CourseGridSection({
    eyebrow,
    title,
    description,
    courses,
}: {
    eyebrow: string;
    title: string;
    description: string;
    courses: ICourse[];
}) {
    return (<section className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {courses.map((course) => {
                return (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                );
            })}
        </div>
    </section>);
}