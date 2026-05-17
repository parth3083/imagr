import { t } from 'elysia';
import { z } from 'zod';

import { analyzeResponseSchema, blueprintSchema, blueprintZodSchema } from './model';

export const weightRangeZodSchema = z.object({
  min: z.number().min(1.0).max(1.5),
  max: z.number().min(1.0).max(1.5),
});

export const promptStyleZodSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  weight_range: weightRangeZodSchema,
});

export const promptStyleElysiaSchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.String({ minLength: 1 }),
  weight_range: t.Object({
    min: t.Number({ minimum: 1.0, maximum: 1.5 }),
    max: t.Number({ minimum: 1.0, maximum: 1.5 }),
  }),
});

export const lockWordZodSchema = z.object({
  word: z.string().min(1),
  format: z.string().min(1),
});

export const lockWordElysiaSchema = t.Object({
  word: t.String({ minLength: 1 }),
  format: t.String({ minLength: 1 }),
});

export const weightedTokenZodSchema = z.object({
  token: z.string().min(1),
  weight: z.number().min(1.0).max(1.5),
  tier: z.enum(['anchor', 'mood_driver', 'style', 'scene_context', 'filler']),
  locked: z.boolean(),
});

export const weightedTokenElysiaSchema = t.Object({
  token: t.String({ minLength: 1 }),
  weight: t.Number({ minimum: 1.0, maximum: 1.5 }),
  tier: t.Union([
    t.Literal('anchor'),
    t.Literal('mood_driver'),
    t.Literal('style'),
    t.Literal('scene_context'),
    t.Literal('filler'),
  ]),
  locked: t.Boolean(),
});

export const lintWarningZodSchema = z.object({
  type: z.enum([
    'vague_language',
    'contradiction',
    'missing_category',
    'weight_conflict',
    'overloaded',
  ]),
  message: z.string().min(1),
  severity: z.enum(['error', 'warning', 'suggestion']),
});

export const lintWarningElysiaSchema = t.Object({
  type: t.Union([
    t.Literal('vague_language'),
    t.Literal('contradiction'),
    t.Literal('missing_category'),
    t.Literal('weight_conflict'),
    t.Literal('overloaded'),
  ]),
  message: t.String({ minLength: 1 }),
  severity: t.Union([t.Literal('error'), t.Literal('warning'), t.Literal('suggestion')]),
});

export const qualityScoreZodSchema = z.object({
  specificity: z.number().int().min(0).max(100),
  coherence: z.number().int().min(0).max(100),
  weight_distribution: z.number().int().min(0).max(100),
  overall: z.number().int().min(0).max(100),
});

export const qualityScoreElysiaSchema = t.Object({
  specificity: t.Integer({ minimum: 0, maximum: 100 }),
  coherence: t.Integer({ minimum: 0, maximum: 100 }),
  weight_distribution: t.Integer({ minimum: 0, maximum: 100 }),
  overall: t.Integer({ minimum: 0, maximum: 100 }),
});

export const weightedOutputZodSchema = z.object({
  weighted_tokens: z.array(weightedTokenZodSchema),
  compiled_prompt: z.string().min(1),
  negative_prompt: z.string().min(1),
  quality_score: qualityScoreZodSchema,
  lint_warnings: z.array(lintWarningZodSchema),
});

export const weightedOutputElysiaSchema = t.Object({
  weighted_tokens: t.Array(weightedTokenElysiaSchema),
  compiled_prompt: t.String(),
  negative_prompt: t.String(),
  quality_score: qualityScoreElysiaSchema,
  lint_warnings: t.Array(lintWarningElysiaSchema),
});

export const weightBlueprintRequestZodSchema = z.object({
  blueprint: blueprintZodSchema,
  prompt_style: promptStyleZodSchema,
  lock_words: z.array(lockWordZodSchema),
});

export const weightBlueprintRequestElysiaSchema = t.Object({
  blueprint: blueprintSchema,
  prompt_style: promptStyleElysiaSchema,
  lock_words: t.Array(lockWordElysiaSchema),
});

export const weightedPromptRequestZodSchema = z.object({
  prompt: z.string().min(1).max(5000),
  model_id: z.string().min(1),
  style_id: z.string().min(1),
  creative_tone: z.number().int().min(0).max(100),
});

export const weightedPromptRequestElysiaSchema = t.Object({
  prompt: t.String({ minLength: 1, maxLength: 5000 }),
  model_id: t.String({ minLength: 1 }),
  style_id: t.String({ minLength: 1 }),
  creative_tone: t.Integer({ minimum: 0, maximum: 100 }),
});

export const modelFormattedOutputZodSchema = z.object({
  positive: z.string(),
  negative: z.string(),
});

export const modelFormattedOutputElysiaSchema = t.Object({
  positive: t.String(),
  negative: t.String(),
});

export const weightedPromptResponseZodSchema = z.object({
  enhancement: z.object({
    blueprint: blueprintZodSchema,
    original_prompt: z.string(),
    expanded_prompt_text: z.string(),
  }),
  weighting: weightedOutputZodSchema,
  model_output: modelFormattedOutputZodSchema,
  model_target: z.enum(['stable_diffusion', 'flux', 'comfyui', 'gpt_image', 'gemini_nano']),
  model_name: z.string(),
  style_name: z.string(),
  creative_tone: z.number().int().min(0).max(100),
});

export const weightedPromptResponseElysiaSchema = t.Object({
  enhancement: analyzeResponseSchema,
  weighting: weightedOutputElysiaSchema,
  model_output: modelFormattedOutputElysiaSchema,
  model_target: t.Union([
    t.Literal('stable_diffusion'),
    t.Literal('flux'),
    t.Literal('comfyui'),
    t.Literal('gpt_image'),
    t.Literal('gemini_nano'),
  ]),
  model_name: t.String(),
  style_name: t.String(),
  creative_tone: t.Integer({ minimum: 0, maximum: 100 }),
});
