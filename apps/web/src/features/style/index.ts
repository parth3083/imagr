import {
  CreateStyleModel,
  StyleDeleteResponse,
  StyleIdParam,
  StyleListQueryModel,
  StyleListResponse,
  StyleNotFound,
  StyleResponse,
  ToggleSaveStyleModel,
  ToggleSaveStyleResponse,
  UseStyleResponse,
} from '@repo/core-types/style';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';
import { getUser } from '@/lib/get-user';

import { StyleService } from './service';

export const style = new Elysia({ prefix: '/style' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, set, request }) => {
      const user = await getUser(request.headers);
      const result = await StyleService.createWithEnhancedPrompt({
        userId: user.id,
        name: body.name,
        basicPrompt: body.basicPrompt,
      });

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
    async ({ query, set, request }) => {
      const user = await getUser(request.headers);
      const result = await StyleService.listByUser({
        userId: user.id,
        cursor: query.cursor,
        limit: query.limit,
        query: query.q,
      });

      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }

      return { success: true, data: result.data };
    },
    {
      query: StyleListQueryModel,
      response: {
        200: StyleListResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/:id',
    async ({ params, set, request }) => {
      const user = await getUser(request.headers);
      const result = await StyleService.findByIdForUser(user.id, params.id);
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
  .patch(
    '/:id/save',
    async ({ params, body, set, request }) => {
      const user = await getUser(request.headers);
      const result = await StyleService.toggleSaved({
        userId: user.id,
        id: params.id,
        saved: body.saved,
      });

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
      body: ToggleSaveStyleModel,
      response: {
        200: ToggleSaveStyleResponse,
        404: StyleNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .post(
    '/:id/use',
    async ({ params, set, request }) => {
      const user = await getUser(request.headers);
      const result = await StyleService.markAsUsed({
        userId: user.id,
        id: params.id,
      });

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
        200: UseStyleResponse,
        404: StyleNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params, set, request }) => {
      const user = await getUser(request.headers);
      const result = await StyleService.deleteById({ userId: user.id, id: params.id });
      if (!result.success) {
        set.status = result.error === 'Style not found' ? 404 : 500;
        return { message: result.error };
      }
      return { message: 'Style deleted successfully' };
    },
    {
      params: StyleIdParam,
      response: {
        200: StyleDeleteResponse,
        404: StyleNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  );
