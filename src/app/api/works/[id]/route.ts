import { prismaClient } from "@/shared/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { IFormDataUpdateWork } from "@/types/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Отсутствует ID работы" },
        { status: 400 },
      );
    }

    const data: IFormDataUpdateWork = await req.json();

    const existingWork = await prismaClient.work.findUnique({
      where: { id },
    });

    if (!existingWork) {
      return NextResponse.json({ error: "Работа не найдена" }, { status: 404 });
    }

    const updatedWork = await prismaClient.work.update({
      where: { id: data.id },
      data: { ...data },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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