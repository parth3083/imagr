import {
  CreateLockWordModel,
  LockWordDeleteResponse,
  LockWordIdParam,
  LockWordListResponse,
  LockWordNotFound,
  LockWordResponse,
  UpdateLockWordModel,
} from '@repo/core-types/lock-word';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';

import { LockWordService } from './service';

export const lockWord = new Elysia({ prefix: '/lock-word' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, set }) => {
      const result = await LockWordService.create(body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      body: CreateLockWordModel,
      response: {
        200: LockWordResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/',
    async ({ set }) => {
      const result = await LockWordService.findAll();
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      response: {
        200: LockWordListResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      const result = await LockWordService.findById(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Lock word not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: LockWordIdParam,
      response: {
        200: LockWordResponse,
        404: LockWordNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const result = await LockWordService.update(params.id, body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Lock word not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: LockWordIdParam,
      body: UpdateLockWordModel,
      response: {
        200: LockWordResponse,
        404: LockWordNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      const result = await LockWordService.delete(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { message: 'Lock word deleted successfully' };
    },
    {
      params: LockWordIdParam,
      response: {
        200: LockWordDeleteResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  );
