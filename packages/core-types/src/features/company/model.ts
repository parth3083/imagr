import { t } from 'elysia';

export const CreateCompanyModel = t.Object({
  name: t.String({ minLength: 1, error: 'Company name is required' }),
  website: t.String({ minLength: 1, error: 'Website is required' }),
  openai: t.String({ minLength: 1, error: 'OpenAI API key is required' }),
});

export const UpdateCompanyModel = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  website: t.Optional(t.String({ minLength: 1 })),
  openai: t.Optional(t.String({ minLength: 1 })),
});

export const CompanyIdParam = t.Object({
  id: t.String(),
});

export const CompanyResponse = t.Object({
  success: t.Boolean(),
  data: t.Any(),
});

export const CompanyListResponse = t.Object({
  success: t.Boolean(),
  data: t.Array(t.Any()),
});

export const CompanyNotFound = t.Object({
  message: t.Literal('Company not found'),
});

export const CompanyDeleteResponse = t.Object({
  message: t.Literal('Company deleted successfully'),
});
