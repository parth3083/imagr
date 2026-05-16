import {
  CreateStyleModel,
  StyleDeleteResponse,
  StyleIdParam,
  StyleListResponse,
  StyleNotFound,
  StyleResponse,
  UpdateStyleModel,
} from '@repo/core-types/style';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';

import { StyleService } from './service';

export const style = new Elysia({ prefix: '/style' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, set }) => {
      const result = await StyleService.create(body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      body: CreateStyleModel,
      response: {
        200: StyleResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/',
    async ({ set }) => {
      const result = await StyleService.findAll();
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      response: {
        200: StyleListResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      const result = await StyleService.findById(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Style not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: StyleIdParam,
      response: {
        200: StyleResponse,
        404: StyleNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const result = await StyleService.update(params.id, body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Style not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: StyleIdParam,
      body: UpdateStyleModel,
      response: {
        200: StyleResponse,
        404: StyleNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      const result = await StyleService.delete(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { message: 'Style deleted successfully' };
    },
    {
      params: StyleIdParam,
      response: {
        200: StyleDeleteResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  );
