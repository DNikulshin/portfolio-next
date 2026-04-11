import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { getWorks } from "@/shared/api/getWorks";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    const data = await getWorks();
    return NextResponse.json(data, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!imageUrl || !linkUrl || !title) {
      return NextResponse.json(
        { error: "Поля title, linkUrl и imageUrl обязательны" },
        { status: 400, headers: corsHeaders },
      );
    }

    const newWork = await prismaClient.work.create({
      data: { title, linkUrl, imageUrl },
    });

    return NextResponse.json(newWork, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Внутренняя ошибка сервера" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
