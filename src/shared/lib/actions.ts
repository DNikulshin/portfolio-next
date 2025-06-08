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

export async function login(prevState: unknown, formData: FormData) {
  const result = authSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  console.log({ email, password });

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      errors: {
        email: ["Неверный email или пароль"],
      },
    };
  }

  const comparePassword = await compare(password, user.passwordHash);

  if (!comparePassword) {
    return {
      errors: {
        email: ["Неверный email или пароль"],
      },
    };
  }

  await createSession(user.id, user.email);

  redirect("/admin");
}

export async function register(prevState: unknown, formData: FormData) {
  const result = authSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      errors: {
        email: ["Пользователь с таким email уже существует"],
      },
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

  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function getUser(): Promise<SessionPayload | undefined> {
  return (await getSessionUser()) as SessionPayload;
}
