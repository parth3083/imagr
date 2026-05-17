'use client';
import { ForgotPasswordType } from '@repo/core-types/auth';
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
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

function ForgotPasswordPage() {
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<ForgotPasswordType>();

  const [isPending, setIsPending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: ForgotPasswordType) => {
    try {
      setIsPending(true);
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message ?? 'Could not send reset email. Please try again.');
        return;
      }
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (sent) {
    return (
      <Card className="border-primary w-full max-w-sm border">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a password reset link to your inbox. It expires in 1 hour.
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-primary w-full max-w-sm border">
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 px-4 pb-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register('email', { required: 'Email is required' })}
            id="email"
            type="email"
            placeholder="m@example.com"
            className="border-primary"
          />
          {errors.email?.message && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </Card>
  );
}

export default ForgotPasswordPage;
