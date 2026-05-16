import { t } from 'elysia';

export const CreateAiModelModel = t.Object({
  name: t.String({ minLength: 1, error: 'Model name is required' }),
  companyId: t.String({ minLength: 1, error: 'Company ID is required' }),
});

export const UpdateAiModelModel = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  companyId: t.Optional(t.String({ minLength: 1 })),
});

export const AiModelIdParam = t.Object({
  id: t.String(),
});

export const AiModelResponse = t.Object({
  success: t.Boolean(),
  data: t.Any(),
});

export const AiModelListResponse = t.Object({
  success: t.Boolean(),
  data: t.Array(t.Any()),
});

export const AiModelNotFound = t.Object({
  message: t.Literal('Model not found'),
});

export const AiModelDeleteResponse = t.Object({
  message: t.Literal('Model deleted successfully'),
});
