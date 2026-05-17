import { analyzeRequestSchema, analyzeResponseSchema } from '@repo/core-types/prompt';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '../auth/auth-middleware';
import { PromptService } from './service';

export const promptEnhancer = new Elysia({ prefix: '/prompt-enhance' }).use(authMiddleware).post(
  '/',
  async ({ body, set }) => {
    try {
      return await PromptService.getExpandedPrompt({
        prompt: body.prompt,
      });
    } catch (error) {
      set.status = 500;
      return {
        message: error instanceof Error ? error.message : 'Prompt expansion failed',
      };
    }
  },
  {
    body: analyzeRequestSchema,
    response: {
      200: analyzeResponseSchema,
      500: t.Object({ message: t.String() }),
    },
  },
);
