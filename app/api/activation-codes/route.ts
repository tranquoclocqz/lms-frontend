import { NextResponse } from "next/server";
import type { CreateActivationCodesPayload } from "@/typing";

export async function GET() {
  return NextResponse.json({
    success: true,
    activationCodes: [],
    data: [],
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateActivationCodesPayload;
    const courseId = body.courseId?.trim();
    const quantity = Number(body.quantity ?? 0);

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "courseId là bắt buộc",
        },
        { status: 400 },
      );
    }

    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 500) {
      return NextResponse.json(
        {
          success: false,
          message: "quantity phải là số nguyên từ 1 đến 500",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Chức năng tạo mã kích hoạt chưa được cấu hình",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("CREATE ACTIVATION CODES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tạo mã kích hoạt",
      },
      { status: 500 },
    );
  }
}
