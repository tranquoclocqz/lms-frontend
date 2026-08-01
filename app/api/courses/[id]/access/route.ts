import { NextResponse } from "next/server";
import { getDemoCourseById } from "@/lib/ui-demo-data";
import type { CourseAccessRouteContext } from "@/typing";

export async function GET(
  _request: Request,
  { params }: CourseAccessRouteContext,
) {
  try {
    const { id } = await params;
    const course = getDemoCourseById(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy khóa học",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      canAccess: course.status === "Published",
      reason: "demo-public",
      isFreeCourse: course.price === 0 || Boolean(course.lessons?.some((lesson) => lesson.isFreePreview)),
      hasEnrollment: false,
      hasPaidOrder: false,
      isTeacherOrAdmin: false,
    });
  } catch (error) {
    console.error("GET COURSE ACCESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể kiểm tra quyền truy cập khóa học",
      },
      { status: 500 },
    );
  }
}
