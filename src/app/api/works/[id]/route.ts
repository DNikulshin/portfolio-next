import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { deleteFile } from "@/shared/lib/minio";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const work = await prismaClient.work.findUnique({ where: { id } });

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
    const { id } = await params;
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const imageUrl = formData.get("imageUrl") as string | null;

    // Если передан новый imageUrl — удаляем старый файл из MinIO
    if (imageUrl) {
      const existing = await prismaClient.work.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      if (existing?.imageUrl) {
        await deleteFile(existing.imageUrl).catch(() => {});
      }
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
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const work = await prismaClient.work.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (work?.imageUrl) {
      await deleteFile(work.imageUrl).catch(() => {});
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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
