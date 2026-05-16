import type { Static } from 'elysia';

import {
  CreateLockWordModel,
  UpdateLockWordModel,
  LockWordIdParam,
  LockWordResponse,
  LockWordListResponse,
  LockWordNotFound,
  LockWordDeleteResponse,
} from './model';

export type CreateLockWordType = Static<typeof CreateLockWordModel>;
export type UpdateLockWordType = Static<typeof UpdateLockWordModel>;
export type LockWordIdParamType = Static<typeof LockWordIdParam>;
export type LockWordResponseType = Static<typeof LockWordResponse>;
export type LockWordListResponseType = Static<typeof LockWordListResponse>;
export type LockWordNotFoundType = Static<typeof LockWordNotFound>;
export type LockWordDeleteResponseType = Static<typeof LockWordDeleteResponse>;
