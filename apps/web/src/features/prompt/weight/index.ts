import {
  weightedPromptRequestElysiaSchema,
  weightedPromptResponseElysiaSchema,
} from '@repo/core-types/prompt';
import { Elysia, t } from 'elysia';

import { authMiddleware } from '@/features/auth/auth-middleware';

import { PromptWeightService } from './service';

/**
 * Weighted Prompt Generation Route
 *
 * This endpoint handles the complete weighted prompt generation pipeline:
 *
 * Flow:
 * 1. Receives raw prompt, model name, style name, and creative tone
 * 2. Calls PromptService.getExpandedPrompt() to enhance the prompt into a structured blueprint
 * 3. Passes the blueprint to PromptWeightService.weightBlueprint() to generate weighted tokens
 * 4. Formats the output using model-specific formatters (switch-case in formatForModel)
 * 5. Returns complete response with enhancement, weighting, and formatted output
 *
 * The service automatically:
 * - Enhances the prompt to get structured blueprint
 * - Applies style-specific lock words
 * - Generates weighted tokens based on creative tone
 * - Formats output for the specific model type (Stable Diffusion, FLUX, ComfyUI, GPT Image)
 */
export const promptWeighter = new Elysia({ prefix: '/weight' }).use(authMiddleware).post(
  '/',
  async ({ body, set }) => {
    try {
      // This single call handles the entire pipeline:
      // 1. Enhance prompt → structured blueprint
      // 2. Weight blueprint → weighted tokens
      // 3. Format for model → model-specific output
      return await PromptWeightService.generateWeightedPrompt(body);
    } catch (error) {
      PromptWeightService.logError(error);
      set.status = PromptWeightService.getErrorStatus(error);
      return {
        message: PromptWeightService.getErrorMessage(error),
      };
    }
  },
  {
    body: weightedPromptRequestElysiaSchema,
    response: {
      200: weightedPromptResponseElysiaSchema,
      404: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
    },
  },
);
