import { t } from 'elysia';
import { z } from 'zod';

enum Source {
  user = 'user_provided',
  ai = 'ai_infered',
}

export const bluePrintEntrySchema = t.Object({
  value: t.String({ minLength: 1 }),
  source: t.Enum(Source),
  confidence: t.Number({ minimum: 0, maximum: 1 }),
});

export const blueprintSchema = t.Object({
  subject: bluePrintEntrySchema,
  scene: bluePrintEntrySchema,
  mood: bluePrintEntrySchema,
  lighting: bluePrintEntrySchema,
  composition: bluePrintEntrySchema,
  style: bluePrintEntrySchema,
  color_palette: bluePrintEntrySchema,
  details: bluePrintEntrySchema,
});

// Zod schemas for AI SDK compatibility
export const bluePrintEntryZodSchema = z.object({
  value: z.string().min(1),
  source: z.enum(['user_provided', 'ai_infered']),
  confidence: z.number().min(0).max(1),
});

export const blueprintZodSchema = z.object({
  subject: bluePrintEntryZodSchema,
  scene: bluePrintEntryZodSchema,
  mood: bluePrintEntryZodSchema,
  lighting: bluePrintEntryZodSchema,
  composition: bluePrintEntryZodSchema,
  style: bluePrintEntryZodSchema,
  color_palette: bluePrintEntryZodSchema,
  details: bluePrintEntryZodSchema,
});

export const analyzeResponseSchema = t.Object({
  blueprint: blueprintSchema,
  original_prompt: t.String(),
  expanded_prompt_text: t.String(),
});

export const analyzeRequestSchema = t.Object({
  prompt: t.String({ minLength: 1, maxLength: 5000 }),
});
