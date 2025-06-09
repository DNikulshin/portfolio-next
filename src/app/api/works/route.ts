import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { IFormDataCreateWork } from "@/types/types";
import { put } from "@vercel/blob";

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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const image = formData.get("image") as File;
    const userId = formData.get("userId") as string;

    // const { image, linkPath, title, userId }: IFormDataCreateWork =
    //   await req.json();

    if (!image || !linkUrl || !title || !userId) {
      return NextResponse.json(
        { error: "Поля формы обязательны" },
        { status: 400 },
      );
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (user && user?.id !== userId) {
      return NextResponse.json({ error: "Доступ запрещен!" }, { status: 403 });
    }

    const blob = await put(image.name, image, {
      access: "public",
      addRandomSuffix: true,
    });

    const newWork = await prismaClient.work.create({
      data: {
        title,
        linkUrl,
        imageUrl: blob.url,
        userId,
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
