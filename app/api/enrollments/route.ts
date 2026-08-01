import { NextRequest, NextResponse } from "next/server";
import { demoEnrollments } from "@/lib/ui-demo-data";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search")?.trim() || "";
    const filtered = demoEnrollments.filter((enrollment) => {
      if (!search) {
        return true;
      }

      return [enrollment.studentName, enrollment.studentEmail, enrollment.status]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });

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
    const body = await request.json();
    const createdEnrollment = {
      _id: `enr-${Date.now()}`,
      studentName: body?.studentName || "Học viên demo",
      studentEmail: body?.studentEmail || "demo@braincourse.local",
      courseId: body?.courseId || "course-1",
      status: body?.status || "active",
      progress: body?.progress || 0,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Thêm học viên thành công",
        enrollment: createdEnrollment,
      },
      { status: 201 },
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
