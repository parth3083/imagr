'use client';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

interface ResetForm {
  newPassword: string;
  confirmPassword: string;
}

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'One digit', test: (v: string) => /\d/.test(v) },
  { label: 'One special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  const [isPending, setIsPending] = useState(false);
  const password = watch('newPassword', '');

  if (!token) {
    return (
      <Card className="border-primary w-full max-w-sm border">
        <CardHeader>
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>This password reset link is missing or malformed.</CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link href="/forgot-password">Request new link</Link>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    );
  }

  const onSubmit = async (data: ResetForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      setIsPending(true);
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });
      if (error) {
        toast.error('Reset link is invalid or expired. Please request a new one.');
        return;
      }
      toast.success('Password updated! Please sign in.');
      setTimeout(() => router.push('/sign-in'), 1500);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="border-primary w-full max-w-sm border">
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Enter a new password for your account.</CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-4 pb-6">
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            {...register('newPassword', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters required' },
              validate: (v) => {
                if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter';
                if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter';
                if (!/\d/.test(v)) return 'Add at least one digit';
                if (!/[^A-Za-z0-9]/.test(v)) return 'Add at least one special character';
                return true;
              },
            })}
            id="newPassword"
            type="password"
            className="border-primary"
          />
          {errors.newPassword?.message && (
            <p className="text-destructive text-sm">{errors.newPassword.message}</p>
          )}
          {password && (
            <ul className="mt-1 flex flex-col gap-1">
              {PASSWORD_RULES.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? 'text-green-500' : 'text-muted-foreground'}`}
                >
                  <span>{rule.test(password) ? '✓' : '○'}</span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            {...register('confirmPassword', { required: 'Please confirm your password' })}
            id="confirmPassword"
            type="password"
            className="border-primary"
          />
          {errors.confirmPassword?.message && (
            <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </Card>
  );
}

export default ResetPasswordPage;
