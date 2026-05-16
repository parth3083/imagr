import {
  AiModelDeleteResponse,
  AiModelIdParam,
  AiModelListResponse,
  AiModelNotFound,
  AiModelResponse,
  CreateAiModelModel,
  UpdateAiModelModel,
} from '@repo/core-types/ai-model';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';

import { AiModelService } from './service';

export const aiModel = new Elysia({ prefix: '/model' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, set }) => {
      const result = await AiModelService.create(body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      body: CreateAiModelModel,
      response: {
        200: AiModelResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/',
    async ({ set }) => {
      const result = await AiModelService.findAll();
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      response: {
        200: AiModelListResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      const result = await AiModelService.findById(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Model not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: AiModelIdParam,
      response: {
        200: AiModelResponse,
        404: AiModelNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const result = await AiModelService.update(params.id, body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Model not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: AiModelIdParam,
      body: UpdateAiModelModel,
      response: {
        200: AiModelResponse,
        404: AiModelNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      const result = await AiModelService.delete(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { message: 'Model deleted successfully' };
    },
    {
      params: AiModelIdParam,
      response: {
        200: AiModelDeleteResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  );
