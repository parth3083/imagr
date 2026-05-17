import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';
import { getUser } from '@/lib/get-user';

import { HistoryService } from './service';

const ConversationItemSchema = t.Object({
  _id: t.String(),
  inputPrompt: t.String(),
  outputPrompt: t.String(),
  negativePrompt: t.String(),
  qualityScore: t.Number(),
  modelName: t.String(),
  styleName: t.String(),
  createdAt: t.String(),
});

const HistoryListQuerySchema = t.Object({
  cursor: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
});

const HistoryListResponseSchema = t.Object({
  success: t.Boolean(),
  data: t.Object({
    items: t.Array(ConversationItemSchema),
    hasNext: t.Boolean(),
    nextCursor: t.Union([t.String(), t.Null()]),
  }),
});

export const history = new Elysia({ prefix: '/history' }).use(authMiddleware).get(
  '/',
  async ({ query, set, request }) => {
    const user = await getUser(request.headers);
    const result = await HistoryService.listByUser({
      userId: user.id,
      cursor: query.cursor,
      limit: query.limit,
    });

    if (!result.success) {
      set.status = 500;
      return { message: result.error };
    }

    return { success: true, data: result.data };
  },
  {
    query: HistoryListQuerySchema,
    response: {
      200: HistoryListResponseSchema,
      500: t.Object({ message: t.String() }),
    },
  },
);
