import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;
    const file = imageFile || videoFile;

    if (!file) {
      return NextResponse.json({ message: "Không tìm thấy file upload" }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return NextResponse.json({ message: "Chỉ chấp nhận file hình ảnh hoặc video" }, { status: 400 });
    }

    const folder = isVideo ? "videos" : "images";
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${folder}/${fileName}` });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ message: "Upload file thất bại" }, { status: 500 });
  }
}
