import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: false,
    message: "Cài đặt chưa được cấu hình",
  });
}

export async function PATCH(request: Request) {
  try {
    await request.json();
    return NextResponse.json({
      success: false,
      message: "Cài đặt chưa được cấu hình",
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
