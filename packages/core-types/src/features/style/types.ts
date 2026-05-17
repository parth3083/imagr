import type { Static } from 'elysia';

import {
  CreateStyleModel,
  StyleListQueryModel,
  ToggleSaveStyleModel,
  UpdateStyleModel,
  StyleIdParam,
  StyleModel,
  StyleResponse,
  StyleListResponse,
  ToggleSaveStyleResponse,
  UseStyleResponse,
  StyleNotFound,
  StyleDeleteResponse,
} from './model';

export type CreateStyleType = Static<typeof CreateStyleModel>;
export type StyleListQueryType = Static<typeof StyleListQueryModel>;
export type ToggleSaveStyleType = Static<typeof ToggleSaveStyleModel>;
export type UpdateStyleType = Static<typeof UpdateStyleModel>;
export type StyleIdParamType = Static<typeof StyleIdParam>;
export type StyleType = Static<typeof StyleModel>;
export type StyleResponseType = Static<typeof StyleResponse>;
export type StyleListResponseType = Static<typeof StyleListResponse>;
export type ToggleSaveStyleResponseType = Static<typeof ToggleSaveStyleResponse>;
export type UseStyleResponseType = Static<typeof UseStyleResponse>;
export type StyleNotFoundType = Static<typeof StyleNotFound>;
export type StyleDeleteResponseType = Static<typeof StyleDeleteResponse>;
