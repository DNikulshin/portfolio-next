import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { IFormDataCreateWork } from "@/types/types";

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
    const { image, linkPath, title, userId }: IFormDataCreateWork =
      await req.json();

    if (!image || !linkPath || !title || !userId) {
      return NextResponse.json(
        { error: "Поля формы обязательны" },
        { status: 400 },
      );
    }

    const newWork = await prismaClient.work.create({
      data: {
        title,
        linkPath,
        image,
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
