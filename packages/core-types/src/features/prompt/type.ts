import type { Static } from 'elysia';

import {
  analyzeRequestSchema,
  analyzeResponseSchema,
  bluePrintEntrySchema,
  blueprintSchema,
} from './model';

export type AnalyzeRequest = Static<typeof analyzeRequestSchema>;
export type AnalyzeResponse = Static<typeof analyzeResponseSchema>;
export type bluePrintEntry = Static<typeof bluePrintEntrySchema>;
export type bluePrint = Static<typeof blueprintSchema>;
