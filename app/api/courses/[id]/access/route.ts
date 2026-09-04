import { NextResponse } from "next/server";
import type { CourseAccessRouteContext } from "@/typing";

export async function GET(
  _request: Request,
  { params }: CourseAccessRouteContext,
) {
  try {
    const { id } = await params;
    void id;
    return NextResponse.json(
      { success: false, message: "Khóa học không tồn tại" },
      { status: 404 },
    );
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
