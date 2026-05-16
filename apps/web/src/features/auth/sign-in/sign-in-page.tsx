'use client';
import { SignInType } from '@repo/core-types/auth';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSignIn } from '../hooks/useSignIn';

function SignInPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<SignInType>();

  const { mutate: signIn, isPending } = useSignIn({
    onSuccess: () => {
      setSuccessMessage('Login successful! Redirecting...');
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(error);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: SignInType) => {
    signIn(data);
  };

  return (
    <Card className="border-primary w-full max-w-sm border">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href={'/sign-up'}>Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 px-4">
        {errorMessage && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
            {successMessage}
          </div>
        )}
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="m@example.com"
              className="border-primary"
            />
            {errors.email?.message && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              {...register('password')}
              id="password"
              type="password"
              className="border-primary"
            />
            {errors.password?.message && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex-col gap-5">
          <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
          <div className="mt-3 flex w-full items-center justify-center gap-2">
            <Button
              variant="outline"
              className="flex w-[49%] cursor-pointer items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Login with Google
            </Button>
            <Button
              variant="outline"
              className="flex w-[49%] cursor-pointer items-center justify-center gap-2"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Login with Github
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

export default SignInPage;
