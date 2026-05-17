import { t } from 'elysia';

export const CreateStyleModel = t.Object({
  name: t.String({ minLength: 1, error: 'Style name is required' }),
  basicPrompt: t.String({ minLength: 1, error: 'Basic prompt is required' }),
});

export const UpdateStyleModel = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  basicPrompt: t.Optional(t.String({ minLength: 1 })),
  extendedPrompt: t.Optional(t.String({ minLength: 1 })),
  type: t.Optional(t.String({ minLength: 1 })),
  isSaved: t.Optional(t.Boolean()),
});

export const StyleIdParam = t.Object({
  id: t.String(),
});

export const StyleListQueryModel = t.Object({
  cursor: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
  q: t.Optional(t.String()),
});

export const ToggleSaveStyleModel = t.Object({
  saved: t.Boolean(),
});

export const StyleModel = t.Object({
  _id: t.Any(),
  userId: t.String(),
  name: t.String(),
  type: t.String(),
  basicPrompt: t.String(),
  extendedPrompt: t.String(),
  isSaved: t.Boolean(),
  usageCount: t.Number(),
  createdAt: t.Any(),
  updatedAt: t.Any(),
});

export const StyleResponse = t.Object({
  success: t.Boolean(),
  data: StyleModel,
});

export const StyleListResponse = t.Object({
  success: t.Boolean(),
  data: t.Object({
    items: t.Array(StyleModel),
    hasNext: t.Boolean(),
    nextCursor: t.Union([t.String(), t.Null()]),
  }),
});

export const ToggleSaveStyleResponse = t.Object({
  success: t.Boolean(),
  data: StyleModel,
});

export const UseStyleResponse = t.Object({
  success: t.Boolean(),
  data: t.Object({
    _id: t.String(),
    usageCount: t.Number(),
  }),
});

export const StyleNotFound = t.Object({
  message: t.Literal('Style not found'),
});

export const StyleDeleteResponse = t.Object({
  message: t.Literal('Style deleted successfully'),
});
