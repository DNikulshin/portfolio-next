'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/kit/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/kit/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/kit/form';
import { register } from '@/shared/lib/actions';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/kit/input';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    startTransition(async () => {
      const response = await register(values);

      if (response.error) {
        setError(response.error);
        toast.error(response.error);
      } else {
        toast.success('Registration successful!');
        router.push('/admin');
      }
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="m@example.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex-col">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
