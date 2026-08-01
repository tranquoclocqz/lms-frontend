import { NextResponse } from "next/server";
import { demoActivationCodes } from "@/lib/ui-demo-data";
import type { CreateActivationCodesPayload } from "@/typing";

function buildDemoActivationCodes(courseId: string, quantity: number) {
  const prefix = `BRAIN-${String(demoActivationCodes.length + 1).padStart(3, "0")}`;

  return Array.from({ length: quantity }, (_, index) => ({
    _id: `code-${Date.now()}-${index + 1}`,
    code: `${prefix}-${index + 1}`,
    courseId,
    isUsed: false,
    usedBy: null,
    usedAt: null,
    createdAt: new Date().toISOString(),
  }));
}

export async function GET() {
  return NextResponse.json({
    success: true,
    activationCodes: demoActivationCodes,
    data: demoActivationCodes,
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

    const createdActivationCodes = buildDemoActivationCodes(courseId, quantity);

    return NextResponse.json(
      {
        success: true,
        message: "Đã tạo mã kích hoạt",
        activationCodes: createdActivationCodes,
        data: createdActivationCodes,
      },
      { status: 201 },
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
