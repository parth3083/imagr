import { isValidObjectId, Types } from 'mongoose';

import connectDB from '@/db/db';
import { Conversation } from '@/db/models';

const DEFAULT_LIMIT = 15;
const MAX_LIMIT = 50;

export type ConversationItem = {
  _id: string;
  inputPrompt: string;
  outputPrompt: string;
  negativePrompt: string;
  qualityScore: number;
  modelName: string;
  styleName: string;
  createdAt: string;
};

type PaginatedResult = {
  items: ConversationItem[];
  hasNext: boolean;
  nextCursor: string | null;
};

export abstract class HistoryService {
  static async listByUser(params: {
    userId: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ success: true; data: PaginatedResult } | { success: false; error: string }> {
    try {
      await connectDB();

      const limit = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
      const filter: Record<string, unknown> = { userId: params.userId };

      if (params.cursor) {
        if (!isValidObjectId(params.cursor)) {
          return { success: false, error: 'Invalid pagination cursor' };
        }
        filter._id = { $lt: new Types.ObjectId(params.cursor) };
      }

      const docs = await Conversation.find(filter)
        .populate({ path: 'modelId', select: 'name' })
        .populate({ path: 'styleId', select: 'name' })
        .sort({ _id: -1 })
        .limit(limit + 1)
        .lean();

      const hasNext = docs.length > limit;
      const items = (hasNext ? docs.slice(0, limit) : docs).map((doc) => ({
        _id: String(doc._id),
        inputPrompt: doc.inputPrompt,
        outputPrompt: doc.outputPrompt,
        negativePrompt: doc.negativePrompt ?? '',
        qualityScore: doc.qualityScore,
        modelName: (doc.modelId as { name?: string } | null)?.name ?? 'Unknown model',
        styleName: (doc.styleId as { name?: string } | null)?.name ?? 'Unknown style',
        createdAt: doc.createdAt.toISOString(),
      }));

      const nextCursor = hasNext ? (items[items.length - 1]?._id ?? null) : null;
      return { success: true, data: { items, hasNext, nextCursor } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch history',
      };
    }
  }
}
