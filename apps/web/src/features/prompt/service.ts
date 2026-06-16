import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  type AnalyzeRequest,
  type AnalyzeResponse,
  type bluePrint,
  blueprintZodSchema,
} from '@repo/core-types/prompt';
import { generateObject } from 'ai';

import { logger } from '@/lib/logger';
import { ANALYZE_SYSTEM_PROMPT } from '@/prompts/systemPrompt';

import { expandedPromptToText } from './utils/prompt-utils';

export abstract class PromptService {
  static async getExpandedPrompt({
    prompt,
    geminiApiKey,
  }: AnalyzeRequest & { geminiApiKey: string }): Promise<AnalyzeResponse> {
    const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await generateObject({
        model: google('gemini-3.5-flash'),
        prompt: `Analyze this image generation prompt and return the structured blueprint:\n\n:${prompt}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: blueprintZodSchema as any,
        system: ANALYZE_SYSTEM_PROMPT,
      });

      if (!result.object) throw new Error('Prompt expansion failed');
      const blueprint = result.object as bluePrint;

      // Expanding the the prompt
      const expandedPrompt = expandedPromptToText(blueprint);
      return {
        blueprint,
        original_prompt: prompt,
        expanded_prompt_text: expandedPrompt,
      };
    } catch (error) {
      logger.error(`Error while expanding prompt : ${error}`);
      throw new Error(error instanceof Error ? error.message : 'Prompt expansion failed');
    }
  }
}
