"use server";
import { z } from "zod";
import {
  createSession,
  deleteSession,
  getSessionUser,
  SessionPayload,
} from "@/shared/lib/session";
import { redirect } from "next/navigation";
import { prismaClient } from "@/shared/lib/prisma-client";
import { compare, hash } from "bcrypt";

const authSchema = z.object({
  email: z.string().email({ message: "Некорректный email" }).trim(),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть не менее 6 символов" })
    .trim(),
});

type AuthResponse = {
  success: boolean;
  error?: string;
};

export async function login(
  values: z.infer<typeof authSchema>,
): Promise<AuthResponse> {
  const validatedFields = authSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Неверные поля" };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return { success: false, error: "Неверный email или пароль" };
    }

    const passwordsMatch = await compare(password, user.passwordHash);

    if (!passwordsMatch) {
      return { success: false, error: "Неверный email или пароль" };
    }

    await createSession(user.id, user.email);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Что-то пошло не так." };
  }
}

export async function register(
  values: z.infer<typeof authSchema>,
): Promise<AuthResponse> {
  const validatedFields = authSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Неверные поля" };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Пользователь с таким email уже существует",
      };
    }

    const passwordHash = await hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    await createSession(user.id, user.email);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Что-то пошло не так." };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function getUser(): Promise<SessionPayload | undefined> {
  return (await getSessionUser()) as SessionPayload;
}
