import {
  SignInModel,
  SignUpModel,
  SignInInvalidate,
  SignUpInvalidate,
  SignInResponse,
  SignUpResponse,
  SignOutResponse,
  SignOutInvalidate,
  GetSessionResponse,
  GetSessionInvalidate,
  ForgotPasswordModel,
  ForgotPasswordResponse,
  ForgotPasswordInvalidate,
  ResetPasswordModel,
  ResetPasswordResponse,
  ResetPasswordInvalidate,
} from '@repo/core-types/auth';
import { Elysia } from 'elysia';

import { auth as betterAuthInstance } from '@/lib/auth';

export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/sign-up',
    async ({ body, set, request }) => {
      if (body.password !== body.confirmPassword) {
        set.status = 400;
        return { message: 'Error in creating the user.' };
      }

      const url = new URL('/api/auth/sign-up/email', request.url);
      const response = await betterAuthInstance.handler(
        new Request(url.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: body.email, password: body.password, name: body.name }),
        }),
      );

      if (!response.ok) {
        set.status = 400;
        return { message: 'Error in creating the user.' };
      }

      const setCookie = response.headers.get('set-cookie');
      if (setCookie) set.headers['set-cookie'] = setCookie;

      return { message: 'User created successfully' };
    },
    {
      body: SignUpModel,
      response: {
        200: SignUpResponse,
        400: SignUpInvalidate,
      },
    },
  )
  .post(
    '/sign-in',
    async ({ body, set, request }) => {
      const url = new URL('/api/auth/sign-in/email', request.url);
      const response = await betterAuthInstance.handler(
        new Request(url.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: body.email, password: body.password }),
        }),
      );

      if (!response.ok) {
        set.status = 403;
        return { message: 'Invalid credentials' };
      }

      const setCookie = response.headers.get('set-cookie');
      if (setCookie) set.headers['set-cookie'] = setCookie;

      return { message: 'User logged in successfully' };
    },
    {
      body: SignInModel,
      response: {
        200: SignInResponse,
        403: SignInInvalidate,
      },
    },
  )
  .post(
    '/sign-out',
    async ({ request, set }) => {
      const url = new URL('/api/auth/sign-out', request.url);
      const response = await betterAuthInstance.handler(
        new Request(url.href, {
          method: 'POST',
          headers: request.headers,
        }),
      );

      if (!response.ok) {
        set.status = 400;
        return { message: 'Failed to sign out user' };
      }

      const setCookie = response.headers.get('set-cookie');
      if (setCookie) set.headers['set-cookie'] = setCookie;

      return { message: 'User signed out successfully' };
    },
    {
      response: {
        200: SignOutResponse,
        400: SignOutInvalidate,
      },
    },
  )
  .get(
    '/session',
    async ({ request, set }) => {
      const url = new URL('/api/auth/get-session', request.url);
      const response = await betterAuthInstance.handler(
        new Request(url.href, {
          method: 'GET',
          headers: request.headers,
        }),
      );

      if (!response.ok) {
        set.status = 401;
        return { message: 'Not authenticated' };
      }

      const data = await response.json();
      return { user: data.user, session: data.session };
    },
    {
      response: {
        200: GetSessionResponse,
        401: GetSessionInvalidate,
      },
    },
  )
  .post(
    '/forgot-password',
    async ({ body, set, request }) => {
      const url = new URL('/api/auth/forget-password', request.url);
      const response = await betterAuthInstance.handler(
        new Request(url.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: body.email,
            redirectTo: `${new URL(request.url).origin}/reset-password`,
          }),
        }),
      );

      if (!response.ok) {
        set.status = 400;
        return { message: 'Failed to send reset email' };
      }

      return { message: 'Password reset email sent' };
    },
    {
      body: ForgotPasswordModel,
      response: {
        200: ForgotPasswordResponse,
        400: ForgotPasswordInvalidate,
      },
    },
  )
  .post(
    '/reset-password',
    async ({ body, set, request }) => {
      const url = new URL('/api/auth/reset-password', request.url);
      const response = await betterAuthInstance.handler(
        new Request(url.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: body.token, newPassword: body.newPassword }),
        }),
      );

      if (!response.ok) {
        set.status = 400;
        return { message: 'Invalid or expired reset link' };
      }

      return { message: 'Password reset successfully' };
    },
    {
      body: ResetPasswordModel,
      response: {
        200: ResetPasswordResponse,
        400: ResetPasswordInvalidate,
      },
    },
  );
