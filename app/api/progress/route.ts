import { NextRequest, NextResponse } from "next/server";

type ProgressPayload = {
  courseId?: string;
  lessonId?: string;
  completed?: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("courseId")?.trim() || "";
    const progress = courseId ? 45 : 0;

    return NextResponse.json({
      success: true,
      completedLessonIds: progress > 0 ? ["lesson-1", "lesson-2"] : [],
      progress,
      completedLessons: progress > 0 ? 2 : 0,
      totalLessons: 4,
    });
  } catch (error) {
    console.error("GET PROGRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải tiến độ học tập",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProgressPayload;
    const completed = body.completed !== false;

    return NextResponse.json({
      success: true,
      message: completed ? "Đã lưu tiến độ bài học" : "Đã cập nhật lại trạng thái bài học",
      progress: completed ? 55 : 0,
      completedLessons: completed ? 3 : 1,
      totalLessons: 4,
      enrollmentStatus: "active",
    });
  } catch (error) {
    console.error("SAVE PROGRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể lưu tiến độ học tập",
      },
      { status: 500 },
    );
  }
}
