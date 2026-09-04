import { NextRequest, NextResponse } from "next/server";
import type { MyCourseItem } from "@/typing";

function isValidObjectId(value: string) {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("courseId")?.trim() || "";
    if (courseId && !isValidObjectId(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã khóa học không hợp lệ",
        },
        { status: 400 },
      );
    }

    const courses: MyCourseItem[] = [];

    return NextResponse.json({
      success: true,
      courses,
      hasAccess: courses.length > 0,
    });
  } catch (error) {
    console.error("GET MY COURSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Không thể tải khóa học của bạn",
      },
      { status: 500 },
    );
  }
}
