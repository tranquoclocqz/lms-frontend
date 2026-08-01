import { NextResponse } from "next/server";
import { demoTeacherSettings } from "@/lib/ui-demo-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: demoTeacherSettings,
    data: demoTeacherSettings,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const settings = {
      ...demoTeacherSettings,
      ...body,
    };

    return NextResponse.json({
      success: true,
      message: "Đã lưu cài đặt",
      settings,
      data: settings,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể lưu cài đặt giảng viên",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return PATCH(request);
}
