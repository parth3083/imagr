import type { Static } from 'elysia';

import {
  CreateCompanyModel,
  UpdateCompanyModel,
  CompanyIdParam,
  CompanyResponse,
  CompanyListResponse,
  CompanyNotFound,
  CompanyDeleteResponse,
} from './model';

export type CreateCompanyType = Static<typeof CreateCompanyModel>;
export type UpdateCompanyType = Static<typeof UpdateCompanyModel>;
export type CompanyIdParamType = Static<typeof CompanyIdParam>;
export type CompanyResponseType = Static<typeof CompanyResponse>;
export type CompanyListResponseType = Static<typeof CompanyListResponse>;
export type CompanyNotFoundType = Static<typeof CompanyNotFound>;
export type CompanyDeleteResponseType = Static<typeof CompanyDeleteResponse>;
