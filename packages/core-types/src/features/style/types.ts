import type { Static } from 'elysia';

import {
  CreateStyleModel,
  UpdateStyleModel,
  StyleIdParam,
  StyleResponse,
  StyleListResponse,
  StyleNotFound,
  StyleDeleteResponse,
} from './model';

export type CreateStyleType = Static<typeof CreateStyleModel>;
export type UpdateStyleType = Static<typeof UpdateStyleModel>;
export type StyleIdParamType = Static<typeof StyleIdParam>;
export type StyleResponseType = Static<typeof StyleResponse>;
export type StyleListResponseType = Static<typeof StyleListResponse>;
export type StyleNotFoundType = Static<typeof StyleNotFound>;
export type StyleDeleteResponseType = Static<typeof StyleDeleteResponse>;
