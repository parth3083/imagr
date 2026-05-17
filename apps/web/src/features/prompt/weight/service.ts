import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  type LockWord,
  type WeightedOutput,
  type WeightedPromptRequest,
  type WeightedPromptResponse,
  type WeightBlueprintRequest,
  weightedOutputZodSchema,
} from '@repo/core-types/prompt';
import { generateObject } from 'ai';

import connectDB from '@/db/db';
import { LockWord as LockWordModel, Model as AiModel, Style } from '@/db/models';
import { logger } from '@/lib/logger';
import { formatForModel, type ModelTarget } from '@/lib/model-router';
import { WEIGHT_SYSTEM_PROMPT } from '@/prompts/weightSystemPrompt';

import { PromptService } from '../service';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

class PromptWeightError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'PromptWeightError';
  }
}

/**
 * Escape special regex characters in a string for safe regex matching.
 */
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parse weight value from lock word format string.
 * Example: "(word:1.3)" returns 1.3
 */
function parseLockWordWeight(format: string): number {
  const match = format.match(/:([\d.]+)\)$/);
  if (!match) return 1.0;

  const parsed = parseFloat(match[1]);
  return Number.isNaN(parsed) ? 1.0 : parsed;
}

/**
 * Inject lock words into the weighted output.
 * Lock words are style-specific tokens that must appear in the final prompt
 * with their predefined weights and formats.
 */
function injectLockWords(llmOutput: WeightedOutput, lockWords: LockWord[]): WeightedOutput {
  if (lockWords.length === 0) return llmOutput;

  const lockedTokens = lockWords.map((lockWord) => ({
    token: lockWord.word,
    weight: parseLockWordWeight(lockWord.format),
    tier: 'style' as const,
    locked: true,
  }));

  const lockWordSection = lockWords.map((lockWord) => lockWord.format).join(', ');

  return {
    ...llmOutput,
    weighted_tokens: [...lockedTokens, ...llmOutput.weighted_tokens],
    compiled_prompt: `${lockWordSection}, ${llmOutput.compiled_prompt}`,
  };
}

/**
 * Calculate weight range based on creative tone (0-100).
 * Higher creative tone allows higher maximum weights for more emphasis.
 */
function getWeightRange(creativeTone: number) {
  const max = 1.1 + (creativeTone / 100) * 0.4;
  return {
    min: 1.0,
    max: Number(max.toFixed(2)),
  };
}

/**
 * Resolve model target type from model name.
 * This helper function determines which formatting function to use
 * based on the model name pattern.
 *
 * @param modelName - Name of the AI model
 * @returns ModelTarget enum value for switch-case routing
 */
function resolveModelTarget(modelName: string): ModelTarget {
  const normalized = modelName.trim().toLowerCase();

  if (normalized.includes('flux')) return 'flux';
  if (normalized.includes('comfy')) return 'comfyui';
  if (
    normalized.includes('gpt image') ||
    normalized.includes('gpt-image') ||
    normalized.includes('dall-e') ||
    normalized.includes('dalle')
  ) {
    return 'gpt_image';
  }

  return 'stable_diffusion';
}

/**
 * Service class for generating weighted prompts from structured blueprints.
 *
 * Flow:
 * 1. Enhance prompt → Get structured blueprint (via PromptService)
 * 2. Weight blueprint → Generate weighted tokens with priorities
 * 3. Format for model → Apply model-specific formatting (via formatForModel)
 */
export abstract class PromptWeightService {
  /**
   * Generate weighted tokens from a structured blueprint.
   * This function takes the enhanced prompt blueprint and applies weighting
   * based on the style, creative tone, and lock words.
   *
   * @param request - Contains blueprint, style info, and lock words
   * @returns Weighted output with tokens, compiled prompt, and metadata
   */
  static async weightBlueprint(request: WeightBlueprintRequest): Promise<WeightedOutput> {
    const { blueprint, prompt_style, lock_words } = request;

    const lowConfidenceCategories = (
      Object.entries(blueprint) as [string, { confidence: number }][]
    )
      .filter(([, entry]) => entry.confidence < 0.6)
      .map(([key]) => key);

    const result = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: weightedOutputZodSchema,
      system: WEIGHT_SYSTEM_PROMPT,
      prompt: JSON.stringify({
        blueprint,
        prompt_style,
        blueprint_categories_with_low_confidence: lowConfidenceCategories,
      }),
    });

    if (!result.object) {
      throw new PromptWeightError('Weight generation returned no object', 500);
    }

    return injectLockWords(result.object as WeightedOutput, lock_words);
  }

  /**
   * Main function to generate a weighted prompt with model-specific formatting.
   *
   * This is the complete pipeline:
   * 1. Call enhance prompt service to get structured blueprint
   * 2. Fetch model and style information from database
   * 3. Generate weighted tokens from the blueprint
   * 4. Format output using model-specific switch-case helper
   *
   * @param request - Contains prompt, model name, style name, and creative tone
   * @returns Complete response with enhancement, weighting, and formatted output
   */
  static async generateWeightedPrompt(
    request: WeightedPromptRequest,
  ): Promise<WeightedPromptResponse> {
    await connectDB();

    // Step 1: Enhance the prompt to get structured blueprint
    // This calls PromptService.getExpandedPrompt which analyzes the raw prompt
    // and returns a structured blueprint with categorized elements
    logger.info('Step 1: Enhancing prompt to generate structured blueprint');
    const enhancement = await PromptService.getExpandedPrompt({
      prompt: request.prompt,
    });
    logger.info('Prompt enhancement completed with blueprint');

    // Step 2: Fetch model and style information
    logger.info('Step 2: Fetching model and style information');
    const model = await AiModel.findOne({
      name: new RegExp(`^${escapeRegex(request.model_name)}$`, 'i'),
    });

    if (!model) {
      throw new PromptWeightError(`Model "${request.model_name}" not found`, 404);
    }

    const style = await Style.findOne({
      name: new RegExp(`^${escapeRegex(request.style_name)}$`, 'i'),
      modelId: model._id,
    });

    if (!style) {
      throw new PromptWeightError(
        `Style "${request.style_name}" not found for model "${request.model_name}"`,
        404,
      );
    }

    const lockWords = await LockWordModel.find({ styleId: style._id }).select('word format');

    // Step 3: Generate weighted prompt from the structured blueprint
    logger.info('Step 3: Generating weighted prompt from structured blueprint');
    const weighting = await this.weightBlueprint({
      blueprint: enhancement.blueprint,
      prompt_style: {
        name: style.name,
        description: style.styleSystemPrompt,
        weight_range: getWeightRange(request.creative_tone),
      },
      lock_words: lockWords.map((lockWord) => ({
        word: lockWord.word,
        format: lockWord.format,
      })),
    });
    logger.info('Weighted prompt generation completed');

    // Step 4: Format output based on model type using switch-case helper
    logger.info(`Step 4: Formatting output for model type: ${model.name}`);
    const modelTarget = resolveModelTarget(model.name);
    const modelOutput = formatForModel(
      weighting.weighted_tokens,
      weighting.negative_prompt,
      modelTarget,
    );
    logger.info(`Output formatted for ${modelTarget} model`);

    return {
      enhancement,
      weighting,
      model_output: modelOutput,
      model_target: modelTarget,
      model_name: model.name,
      style_name: style.name,
      creative_tone: request.creative_tone,
    };
  }

  static getErrorStatus(error: unknown) {
    return error instanceof PromptWeightError ? error.status : 500;
  }

  static getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Weight generation failed';
  }

  static logError(error: unknown) {
    logger.error(`Error during weight generation: ${error}`);
  }
}
