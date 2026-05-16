import { t } from 'elysia';

export const CreateStyleModel = t.Object({
  name: t.String({ minLength: 1, error: 'Style name is required' }),
  styleSystemPrompt: t.String({ minLength: 1, error: 'Style system prompt is required' }),
  modelId: t.String({ minLength: 1, error: 'Model ID is required' }),
  tags: t.Optional(t.Array(t.String())),
});

export const UpdateStyleModel = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  styleSystemPrompt: t.Optional(t.String({ minLength: 1 })),
  modelId: t.Optional(t.String({ minLength: 1 })),
  tags: t.Optional(t.Array(t.String())),
});

export const StyleIdParam = t.Object({
  id: t.String(),
});

export const StyleResponse = t.Object({
  success: t.Boolean(),
  data: t.Any(),
});

export const StyleListResponse = t.Object({
  success: t.Boolean(),
  data: t.Array(t.Any()),
});

export const StyleNotFound = t.Object({
  message: t.Literal('Style not found'),
});

export const StyleDeleteResponse = t.Object({
  message: t.Literal('Style deleted successfully'),
});
