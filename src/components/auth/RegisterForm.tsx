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
      <Card className="w-full border-border md:w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
            <input
              id="email"
              name="email"
              placeholder="m@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          {state?.errors?.email && (
            <p className="text-sm text-red-500 break-words">{state.errors.email}</p>
          )}
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Введите пароль..."
            />
          </div>
          {state?.errors?.password && (
            <p className="text-sm text-red-500 break-words">{state.errors.password}</p>
          )}
        </CardContent>
        <CardFooter className='flex w-full flex-col'>
          <SubmitButton
            isPendingText="Подождите..."
            text="Создать аккаунт"
          />
          <div className="mt-4 w-full text-center text-sm">
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
