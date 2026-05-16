import { t } from 'elysia';

export const CreateLockWordModel = t.Object({
  word: t.String({ minLength: 1, error: 'Lock word is required' }),
  format: t.String({ minLength: 1, error: 'Format is required' }),
  styleId: t.String({ minLength: 1, error: 'Style ID is required' }),
});

export const UpdateLockWordModel = t.Object({
  word: t.Optional(t.String({ minLength: 1 })),
  format: t.Optional(t.String({ minLength: 1 })),
  styleId: t.Optional(t.String({ minLength: 1 })),
});

export const LockWordIdParam = t.Object({
  id: t.String(),
});

export const LockWordResponse = t.Object({
  success: t.Boolean(),
  data: t.Any(),
});

export const LockWordListResponse = t.Object({
  success: t.Boolean(),
  data: t.Array(t.Any()),
});

export const LockWordNotFound = t.Object({
  message: t.Literal('Lock word not found'),
});

export const LockWordDeleteResponse = t.Object({
  message: t.Literal('Lock word deleted successfully'),
});
