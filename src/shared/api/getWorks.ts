import { prismaClient } from "@/shared/lib/prisma-client";

export async function getWorks() {
  try {
    const [totalCount, works] = await prismaClient.$transaction([
      prismaClient.work.count(),
      prismaClient.work.findMany({}),
    ]);

    return { works, totalCount };
  } catch (error) {
    console.error("Ошибка при получении работ:", error);
    throw new Error("Не удалось получить работы. Пожалуйста, попробуйте еще раз.");
  }
}
