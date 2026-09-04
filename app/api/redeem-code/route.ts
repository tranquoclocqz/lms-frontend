import { NextResponse } from "next/server";

type RedeemCodePayload = {
  code?: string;
  studentName?: string;
  studentEmail?: string;
};

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RedeemCodePayload;
    const code = body.code ? normalizeCode(body.code) : "";
    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã kích hoạt là bắt buộc",
        },
        { status: 400 },
      );
    }

    void body;
    void code;
    return NextResponse.json(
      { success: false, message: "Chức năng kích hoạt mã chưa được cấu hình" },
      { status: 501 },
    );
  } catch (error) {
    console.error("REDEEM CODE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Không thể kích hoạt mã",
      },
      { status: 500 },
    );
  }
}
