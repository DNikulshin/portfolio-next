import { prismaClient } from "@/shared/lib/prisma-client";

export async function getWorks() {
  try {
    const totalCount = await prismaClient.work.count();
    const works = await prismaClient.work.findMany({});

    return { works, totalCount };
  } catch (error) {
    console.error("Ошибка при получении работ:", error);
    throw new Error("Не удалось получить работы. Пожалуйста, попробуйте еще раз.");
  }
}
