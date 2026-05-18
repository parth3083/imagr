import { analyzeRequestSchema, analyzeResponseSchema } from '@repo/core-types/prompt';
import { Elysia, t } from 'elysia';

import { getUser } from '@/lib/get-user';

import { authMiddleware } from '../auth/auth-middleware';
import { UserSettingsService } from '../user-settings/service';
import { PromptService } from './service';

export const promptEnhancer = new Elysia({ prefix: '/prompt-enhance' }).use(authMiddleware).post(
  '/',
  async ({ body, set, request }) => {
    try {
      const user = await getUser(request.headers);
      const geminiApiKey = await UserSettingsService.getApiKey(user.id);
      if (!geminiApiKey) {
        set.status = 403;
        return { message: 'No Gemini API key configured. Go to Settings to add one.' };
      }
      return await PromptService.getExpandedPrompt({
        prompt: body.prompt,
        geminiApiKey,
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
      403: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
  },
);
