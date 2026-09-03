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
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">
                    {eyebrow}
                </p>
                <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.95rem]">
                    {title}
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>
        </div>

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