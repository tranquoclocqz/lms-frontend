import { NextResponse } from "next/server";
import { deriveStudentName, normalizeStudentEmail } from "@/lib/enrollment-utils";
import { demoActivationCodes, demoCourses } from "@/lib/ui-demo-data";

type RedeemCodePayload = {
  code?: string;
  studentId?: string;
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
    const studentId = body.studentId?.trim() || "demo-user";
    const studentEmail = body.studentEmail
      ? normalizeStudentEmail(body.studentEmail)
      : `demo-${studentId}@braincourse.local`;
    const studentName = deriveStudentName(body.studentName);

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã kích hoạt là bắt buộc",
        },
        { status: 400 },
      );
    }

    const activationCode = demoActivationCodes.find((item) => item.code === code);

    if (!activationCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã kích hoạt không tồn tại",
        },
        { status: 404 },
      );
    }

    const courseId = typeof activationCode.courseId === "string"
      ? activationCode.courseId
      : activationCode.courseId?._id || "";
    const course = demoCourses.find((item) => item._id === courseId) || null;

    return NextResponse.json({
      success: true,
      message: "Kích hoạt khóa học thành công",
      enrollment: {
        _id: `enr-${Date.now()}`,
        studentName,
        studentEmail,
        courseId: courseId || course?._id,
        status: "active",
        progress: 0,
        enrolledAt: new Date().toISOString(),
      },
      course,
      activationCode,
    });
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
