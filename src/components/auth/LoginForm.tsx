"use client";

import { useActionState } from "react";
import { login } from "@/shared/lib/actions";
import { SubmitButton } from "./SubmitButton";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/kit/card";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form action={loginAction}>
      <Card className="w-full border-border md:w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
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
            <div className="flex items-center">
              <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
            </div>
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
            text="Войти"
            className="w-full"
          />
          <div className="mt-4 w-full text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
