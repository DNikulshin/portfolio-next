import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadFile } from "@/shared/lib/minio";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл обязателен" }, { status: 400 });
    }

    const url = await uploadFile(file);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Ошибка загрузки файла" },
      { status: 500 },
    );
  }
}
