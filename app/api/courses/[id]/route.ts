import { NextRequest, NextResponse } from "next/server";
import type { CourseUpdatePayload, CourseAccessRouteContext } from "@/typing";

export async function GET(
  _request: NextRequest,
  { params }: CourseAccessRouteContext,
) {
  try {
    const { id } = await params;
    void id;
    return NextResponse.json(
      { success: false, message: "Khóa học không tồn tại" },
      { status: 404 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Không thể tải khóa học lúc này." },
      { status: 503 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: CourseAccessRouteContext) {
  const { id } = await params;
  const body = (await request.json()) as CourseUpdatePayload;

  if (!body.title?.trim()) {
    return NextResponse.json(
      { success: false, message: "Tên khóa học là bắt buộc" },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.lessons) || body.lessons.length === 0) {
    return NextResponse.json(
      { success: false, message: "Ít nhất một bài giảng là bắt buộc" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, data: { id, ...body } });
}

export async function DELETE(_request: NextRequest, { params }: CourseAccessRouteContext) {
  const { id } = await params;

  return NextResponse.json({ success: true, message: `Khóa học ${id} đã được xóa` });
}
