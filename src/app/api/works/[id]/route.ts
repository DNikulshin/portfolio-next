import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { put, del } from "@vercel/blob";

// Определение CORS-заголовков для многократного использования
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const work = await prismaClient.work.findUnique({
      where: { id },
    });
    if (!work) {
      return NextResponse.json(
        { error: "Work not found" },
        { status: 404, headers: corsHeaders },
      );
    }
    return NextResponse.json(work, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const image = formData.get("image") as File | null;

    let imageUrl: string | undefined;

    if (image) {
      const existingWork = await prismaClient.work.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      if (existingWork && existingWork.imageUrl) {
        await del(existingWork.imageUrl);
      }

      const blob = await put(image.name, image, {
        access: "public",
        addRandomSuffix: true,
      });
      imageUrl = blob.url;
    }

    const updatedWork = await prismaClient.work.update({
      where: { id },
      data: {
        title,
        linkUrl,
        ...(imageUrl && { imageUrl }),
      },
    });

    return NextResponse.json(updatedWork, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const workToDelete = await prismaClient.work.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (workToDelete && workToDelete.imageUrl) {
      await del(workToDelete.imageUrl);
    }

    await prismaClient.work.delete({ where: { id } });

    return NextResponse.json(
      { message: "Work deleted" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// Обработчик для OPTIONS-запросов (preflight)
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}
