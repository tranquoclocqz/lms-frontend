import { NextRequest, NextResponse } from "next/server";
import type { CoursePayload } from "@/typing";

function sanitizeLessons(lessons: CoursePayload["lessons"] = []) {
  return lessons
    .filter((lesson) => lesson.title?.trim())
    .map((lesson, index) => ({
      title: lesson.title!.trim(),
      description: lesson.description?.trim() || "",
      videoSource: lesson.videoSource === "bunny" ? "bunny" : "local",
      videoUrl: lesson.videoUrl?.trim() || "",
      duration: lesson.duration?.trim() || "",
      isFreePreview: Boolean(lesson.isFreePreview),
      order: Number.isFinite(lesson.order) ? Number(lesson.order) : index + 1,
    }))
    .sort((left, right) => left.order - right.order)
    .map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));
}

export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("id");
    const scope = request.nextUrl.searchParams.get("scope");
    void scope;

    if (courseId) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy khóa học" },
        { status: 404 },
      );
    }

    const courses: CoursePayload[] = [];

    return NextResponse.json({
      success: true,
      courses,
      data: courses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải dữ liệu khóa học lúc này.",
        courses: [],
        data: [],
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CoursePayload;
    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên khóa học là bắt buộc",
        },
        { status: 400 },
      );
    }

    const lessons = sanitizeLessons(body.lessons);
    const numericPrice = Number(body.price ?? 0);
    const numericOriginalPrice = Number(body.originalPrice ?? 0);
    const numericDiscountPrice = Number(body.discountPrice ?? 0);

    if (lessons.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng thêm ít nhất một bài học cho khóa học",
        },
        { status: 400 },
      );
    }

    for (const [index, lesson] of lessons.entries()) {
      if (!lesson.videoUrl) {
        return NextResponse.json(
          {
            success: false,
            message:
              lesson.videoSource === "bunny"
                ? `Bunny embed URL của bài giảng ${index + 1} là bắt buộc`
                : `Video bài giảng ${index + 1} chưa được upload`,
          },
          { status: 400 },
        );
      }
    }

    const course = {
      _id: `course-${Date.now()}`,
      title,
      shortDescription: body.shortDescription?.trim() || "",
      description: body.description?.trim() || "",
      thumbnailUrl: body.thumbnailUrl?.trim() || "",
      category: body.category?.trim() || "General",
      level: body.level || "Beginner",
      language: body.language?.trim() || "Vietnamese",
      price: Number.isFinite(numericPrice) && numericPrice >= 0 ? numericPrice : 0,
      originalPrice:
        Number.isFinite(numericOriginalPrice) && numericOriginalPrice >= 0
          ? numericOriginalPrice
          : 0,
      discountPrice:
        Number.isFinite(numericDiscountPrice) && numericDiscountPrice >= 0
          ? numericDiscountPrice
          : 0,
      authorName: body.authorName?.trim() || "BrainCourse Admin",
      status: body.status || "Draft",
      lessons,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        course,
        data: course,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tạo khóa học",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("id");

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã khóa học là bắt buộc",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa khóa học",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể xóa khóa học",
      },
      { status: 500 },
    );
  }
}
