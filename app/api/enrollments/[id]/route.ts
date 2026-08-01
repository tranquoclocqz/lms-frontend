import { NextRequest, NextResponse } from "next/server";
import type { EnrollmentRouteContext, UpdateEnrollmentPayload } from "@/typing";

export async function PATCH(request: NextRequest, { params }: EnrollmentRouteContext) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateEnrollmentPayload;

    return NextResponse.json({
      success: true,
      message: "Cập nhật học viên thành công",
      enrollment: {
        _id: id,
        status: body.status || "active",
        progress: body.progress ?? 0,
      },
    });
  } catch (error) {
    console.error("UPDATE ENROLLMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể cập nhật học viên",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: EnrollmentRouteContext) {
  try {
    const { id } = await params;

    return NextResponse.json({
      success: true,
      message: `Đã xóa học viên ${id} khỏi khóa học`,
    });
  } catch (error) {
    console.error("DELETE ENROLLMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể xóa học viên",
      },
      { status: 500 },
    );
  }
}
