import { CourseEditor } from "@/components/CourseEditor";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CourseEditor mode="edit" courseId={id} />;
}
