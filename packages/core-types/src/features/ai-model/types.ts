import type { Static } from 'elysia';

import {
  CreateAiModelModel,
  UpdateAiModelModel,
  AiModelIdParam,
  AiModelResponse,
  AiModelListResponse,
  AiModelNotFound,
  AiModelDeleteResponse,
} from './model';

export type CreateAiModelType = Static<typeof CreateAiModelModel>;
export type UpdateAiModelType = Static<typeof UpdateAiModelModel>;
export type AiModelIdParamType = Static<typeof AiModelIdParam>;
export type AiModelResponseType = Static<typeof AiModelResponse>;
export type AiModelListResponseType = Static<typeof AiModelListResponse>;
export type AiModelNotFoundType = Static<typeof AiModelNotFound>;
export type AiModelDeleteResponseType = Static<typeof AiModelDeleteResponse>;
