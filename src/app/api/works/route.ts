import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import path from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const totalCount = await prismaClient.work.count();
    const works = await prismaClient.work.findMany({});

    return NextResponse.json({ works, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обработке GET запроса:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    if (!data) {
      return NextResponse.json({ error: "Нет данных формы" }, { status: 400 });
    }

    const title = data.get("title") as string;
    const linkPath = data.get("linkPath") as string;
    const userId = data.get("userId") as string;
    const imageFile = data.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Нет загруженного изображения" },
        { status: 400 },
      );
    }

    const imageBuffer = await imageFile.arrayBuffer();

    const uploadsDir = path.join(process.cwd(), "public", "slides");
    const filename = `${randomUUID()}_${imageFile.name}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(filePath, Buffer.from(imageBuffer));

    const imagePath = path.posix.join("/slides", filename);

    const id = filename.split("_")[0];
    console.log(userId);

    const newWork = await prismaClient.work.create({
      data: {
        id,
        title,
        linkPath,
        userId,
        imagePath,
      },
    });

    return NextResponse.json(newWork, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обработке POST запроса:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
