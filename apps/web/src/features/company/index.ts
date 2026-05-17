import {
  CompanyDeleteResponse,
  CompanyIdParam,
  CompanyListResponse,
  CompanyNotFound,
  CompanyResponse,
  CreateCompanyModel,
  UpdateCompanyModel,
} from '@repo/core-types/company';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';

import { CompanyService } from './service';

export const company = new Elysia({ prefix: '/company' })
  .use(authMiddleware)
  .post(
    '/',
    async ({ body, set }) => {
      const result = await CompanyService.create(body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      body: CreateCompanyModel,
      response: {
        200: CompanyResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/',
    async ({ set }) => {
      const result = await CompanyService.findAll();
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { success: true, data: result.data };
    },
    {
      response: {
        200: CompanyListResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .get(
    '/:id',
    async ({ params, set }) => {
      const result = await CompanyService.findById(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Company not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: CompanyIdParam,
      response: {
        200: CompanyResponse,
        404: CompanyNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const result = await CompanyService.update(params.id, body);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      if (!result.data) {
        set.status = 404;
        return { message: 'Company not found' };
      }
      return { success: true, data: result.data };
    },
    {
      params: CompanyIdParam,
      body: UpdateCompanyModel,
      response: {
        200: CompanyResponse,
        404: CompanyNotFound,
        500: t.Object({ message: t.String() }),
      },
    },
  )
  .delete(
    '/:id',
    async ({ params, set }) => {
      const result = await CompanyService.delete(params.id);
      if (!result.success) {
        set.status = 500;
        return { message: result.error };
      }
      return { message: 'Company deleted successfully' };
    },
    {
      params: CompanyIdParam,
      response: {
        200: CompanyDeleteResponse,
        500: t.Object({ message: t.String() }),
      },
    },
  );
