import { NextResponse } from "next/server";

export async function processPaymentWebhook(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: "Webhook thanh toán đã được chấp nhận ở chế độ giao diện mẫu.",
      payload,
    });
  } catch (error) {
    console.error("PAYMENT WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Xử lý webhook thanh toán thất bại",
      },
      { status: 500 },
    );
  }
}
