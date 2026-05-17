import { Elysia, t } from 'elysia';

import { auth } from '@/features/auth';
import { betterAuth } from '@/features/auth/utils/elysia-better-auth';
import { company } from '@/features/company';
import { lockWord } from '@/features/lock-word';
import { aiModel } from '@/features/model';
import { promptEnhancer } from '@/features/prompt';
import { promptWeighter } from '@/features/prompt/weight';
import { style } from '@/features/style';

export const app = new Elysia({ prefix: '/api' })
  .use(betterAuth)
  .use(auth)
  .use(company)
  .use(aiModel)
  .use(style)
  .use(lockWord)
  .use(promptEnhancer)
  .use(promptWeighter);

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
