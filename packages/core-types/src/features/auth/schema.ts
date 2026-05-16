import { z } from 'zod';

export const SIGN_IN_SCHEMA = z.object({
  email: z.email('Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const SIGN_UP_SCHEMA = z
  .object({
    email: z.email('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
