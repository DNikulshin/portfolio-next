"use client";

import { useActionState } from "react";
import { register } from "@/shared/lib/actions";
import Link from "next/link";
import { SubmitButton } from "./SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/kit/card";

export function RegisterForm() {
  const [state, registerAction] = useActionState(register, undefined);

  return (
    <form action={registerAction}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="m@example.com"
              className="px-4 py-2 rounded-sm border border-white text-md"
            />
          </div>
          {state?.errors?.email && (
            <p className="text-red-500 break-words">{state.errors.email}</p>
          )}
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="px-4 py-2 rounded-sm border border-white text-md"
              placeholder="Введите пароль..."
            />
          </div>
          {state?.errors?.password && (
            <p className="text-red-500 break-words">{state.errors.password}</p>
          )}
        </CardContent>
        <CardFooter className='flex flex-col items-start'>
          <SubmitButton
            isPendingText="Подождите..."
            text="Создать аккаунт"
          />
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
