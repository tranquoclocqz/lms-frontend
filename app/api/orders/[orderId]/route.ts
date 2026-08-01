import { NextResponse } from "next/server";
import { buildOrderPaymentCode, buildVietQrUrl } from "@/lib/sepay";

type OrderRouteContext = {
  params: Promise<{ orderId: string }>;
};

const CHECKOUT_BANK_NAME = "Sacombank (STB)";
const CHECKOUT_BANK_CODE = "STB";
const CHECKOUT_BANK_ACCOUNT = "060339723145";
const CHECKOUT_BANK_ACCOUNT_NAME = "LE THI NGOC MAI";

export async function GET(_request: Request, { params }: OrderRouteContext) {
  try {
    const { orderId } = await params;
    const transferContent = "Demo Ck";

    return NextResponse.json({
      success: true,
      orderId,
      status: "pending",
      courseId: "course-1",
      amount: 1290000,
      transferContent,
      firstLessonId: "1",
      order: {
        id: orderId,
        courseId: "course-1",
        amount: 1290000,
        studentEmail: "demo@braincourse.local",
        transferContent,
        status: "pending",
        firstLessonId: "1",
        orderCode: buildOrderPaymentCode(orderId),
        paymentCode: buildOrderPaymentCode(orderId),
        paymentMethod: "bank-transfer",
        createdAt: new Date().toISOString(),
        paidAt: null,
        transactionId: null,
        course: {
          title: "Product Design Essentials",
          thumbnailUrl: "",
        },
      },
      bank: {
        bankName: CHECKOUT_BANK_NAME,
        bankCode: CHECKOUT_BANK_CODE,
        bankAccount: CHECKOUT_BANK_ACCOUNT,
        accountName: CHECKOUT_BANK_ACCOUNT_NAME,
      },
      qrUrl: buildVietQrUrl({
        amount: 1290000,
        paymentCode: transferContent,
        bankCode: CHECKOUT_BANK_CODE,
        accountNumber: CHECKOUT_BANK_ACCOUNT,
        accountName: CHECKOUT_BANK_ACCOUNT_NAME,
      }),
    });
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
