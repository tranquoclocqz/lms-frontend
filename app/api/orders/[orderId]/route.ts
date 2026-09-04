import { NextResponse } from "next/server";

type OrderRouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, { params }: OrderRouteContext) {
  try {
    const { orderId } = await params;
    void orderId;
    return NextResponse.json(
      { success: false, message: "Đơn hàng không tồn tại" },
      { status: 404 },
    );
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể tải thông tin đơn hàng",
      },
      { status: 500 },
    );
  }
}
