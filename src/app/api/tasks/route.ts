import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { auth } from "@/auth";
import { Priority } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, priority, projectId } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "title и projectId обязательны" },
        { status: 400 },
      );
    }

    const task = await prismaClient.task.create({
      data: {
        title,
        description,
        priority: (priority as Priority) ?? "MEDIUM",
        projectId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
