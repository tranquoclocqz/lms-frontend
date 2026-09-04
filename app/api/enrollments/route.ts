import { NextRequest, NextResponse } from "next/server";
import type { EnrollmentItem } from "@/typing";

export async function GET(request: NextRequest) {
  try {
    request.nextUrl.searchParams.get("search");
    const filtered: EnrollmentItem[] = [];

    return NextResponse.json({
      success: true,
      enrollments: filtered,
      stats: {
        totalStudents: filtered.length,
        activeStudents: filtered.filter((item) => item.status === "active").length,
        completedStudents: filtered.filter((item) => item.status === "completed").length,
        completionRate: filtered.length > 0 ? Math.round((filtered.filter((item) => item.status === "completed").length / filtered.length) * 100) : 0,
      },
      isEnrolled: filtered.length > 0,
      enrollment: filtered[0] || null,
    });
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải danh sách học viên",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await request.json();
    return NextResponse.json(
      { success: false, message: "Chức năng ghi danh chưa được cấu hình" },
      { status: 501 },
    );
  } catch (error) {
    console.error("CREATE ENROLLMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể thêm học viên",
      },
      { status: 500 },
    );
  }
}
