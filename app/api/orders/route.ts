import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = `order-${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: orderId,
          courseId: body?.courseId || "course-1",
          status: "pending",
          amount: 1290000,
          studentEmail: body?.studentEmail || "demo@braincourse.local",
        },
        orderId,
        orderCode: `BC-${orderId.toUpperCase()}`,
        checkoutUrl: `/student/checkout/${orderId}`,
      },
      { status: 201 },
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
