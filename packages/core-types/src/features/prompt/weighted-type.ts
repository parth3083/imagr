import type { Static } from 'elysia';

import {
  lockWordElysiaSchema,
  lintWarningElysiaSchema,
  modelFormattedOutputElysiaSchema,
  promptStyleElysiaSchema,
  qualityScoreElysiaSchema,
  weightedOutputElysiaSchema,
  weightedPromptRequestElysiaSchema,
  weightedPromptResponseElysiaSchema,
  weightedTokenElysiaSchema,
  weightBlueprintRequestElysiaSchema,
} from './weighted-model';

export type WeightedToken = Static<typeof weightedTokenElysiaSchema>;
export type LintWarning = Static<typeof lintWarningElysiaSchema>;
export type QualityScore = Static<typeof qualityScoreElysiaSchema>;
export type WeightedOutput = Static<typeof weightedOutputElysiaSchema>;
export type PromptStyle = Static<typeof promptStyleElysiaSchema>;
export type LockWord = Static<typeof lockWordElysiaSchema>;
export type ModelFormattedOutput = Static<typeof modelFormattedOutputElysiaSchema>;
export type WeightBlueprintRequest = Static<typeof weightBlueprintRequestElysiaSchema>;
export type WeightedPromptRequest = Static<typeof weightedPromptRequestElysiaSchema>;
export type WeightedPromptResponse = Static<typeof weightedPromptResponseElysiaSchema>;
