import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { auth } from "@/auth";
import { TaskStatus, Priority } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, status, priority } = body;

    const task = await prismaClient.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status: status as TaskStatus }),
        ...(priority !== undefined && { priority: priority as Priority }),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prismaClient.task.delete({ where: { id } });
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
