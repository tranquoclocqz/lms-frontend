import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      data: {
        _id: `lesson-${Date.now()}`,
        ...body,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Không thể tạo bài học",
      },
      { status: 500 },
    );
  }
}
