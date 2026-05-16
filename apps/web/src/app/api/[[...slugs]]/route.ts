import { Elysia, t } from 'elysia';

import { auth } from '@/features/auth';
import { betterAuth } from '@/features/auth/utils/elysia-better-auth';
import { company } from '@/features/company';
import { lockWord } from '@/features/lock-word';
import { aiModel } from '@/features/model';
import { style } from '@/features/style';

export const app = new Elysia({ prefix: '/api' })
  .use(betterAuth)
  .use(auth)
  .use(company)
  .use(aiModel)
  .use(style)
  .use(lockWord)
  .get('/', 'Hello Nextjs')
  .post('/', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  });

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
