import { Elysia, t } from 'elysia';

import { betterAuth } from '@/features/auth/utils/elysia-better-auth';

export const app = new Elysia({ prefix: '/api' })
  .use(betterAuth)
  .get('/', 'Hello Nextjs')
  .post('/', ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  });

export const GET = app.fetch;
export const POST = app.fetch;
