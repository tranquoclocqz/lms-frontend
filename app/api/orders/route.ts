import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json(
      {
        success: false,
        message: "Chức năng tạo đơn hàng chưa được cấu hình",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Tạo đơn hàng thất bại",
      },
      { status: 500 },
    );
  }
}
