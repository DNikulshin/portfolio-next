import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/shared/lib/prisma-client";
import { auth } from "@/auth";

export async function GET() {
  try {
    const projects = await prismaClient.project.findMany({
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, githubUrl, deployUrl } = body;

    if (!title) {
      return NextResponse.json({ error: "title обязателен" }, { status: 400 });
    }

    const project = await prismaClient.project.create({
      data: { title, description, githubUrl, deployUrl },
      include: { tasks: true },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
