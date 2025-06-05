import { prismaClient } from "@/shared/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Отсутствует ID работы" },
        { status: 400 },
      );
    }

    const work = await prismaClient.work.findUnique({ where: { id } });

    if (!work) {
      return NextResponse.json({ error: "Работа не найдена" }, { status: 404 });
    }

    return NextResponse.json(work, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обработке GET запроса:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Отсутствует ID работы" },
        { status: 400 },
      );
    }

    const work = await prismaClient.work.findUnique({ where: { id } });

    if (!work) {
      return NextResponse.json({ error: "Работа не найдена" }, { status: 404 });
    }

    if (work.imagePath) {
      const imageFullPath = path.join(process.cwd(), "public", work.imagePath);
      try {
        await fs.unlink(imageFullPath);
      } catch (err) {
        console.warn("Не удалось удалить изображение:", err);
      }
    }

    await prismaClient.work.delete({ where: { id } });

    return NextResponse.json(
      { message: "Работа успешно удалена" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка при удалении работы:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Отсутствует ID работы" },
        { status: 400 },
      );
    }

    const data = await req.formData();

    const title = data.get("title") as string;
    const linkPath = data.get("linkPath") as string;
    const userId = data.get("userId") as string;
    const imageFile = data.get("image") as File | null;

    const existingWork = await prismaClient.work.findUnique({
      where: { id },
    });

    if (!existingWork) {
      return NextResponse.json({ error: "Работа не найдена" }, { status: 404 });
    }

    let imagePath: string | undefined;

    if (imageFile && imageFile.size > 0) {
      if (existingWork.imagePath) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingWork.imagePath,
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error("Ошибка при удалении старой картинки:", err);
        }
      }
      const imageBuffer = await imageFile.arrayBuffer();
      const uploadsDir = path.join(process.cwd(), "public", "slides");
      const filename = `${id}_${imageFile.name}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(filePath, Buffer.from(imageBuffer));
      imagePath = path.posix.join("/slides", filename);
    }

    type UpdateData = {
      title: string;
      linkPath: string;
      userId: string;
      imagePath?: string;
    };
    const updateData: UpdateData = {
      title,
      linkPath,
      userId,
      imagePath,
    };

    if (imagePath) {
      updateData.imagePath = imagePath;
    }

    const updatedWork = await prismaClient.work.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedWork, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении работы:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
