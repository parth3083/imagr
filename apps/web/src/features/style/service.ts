import { type QueryFilter, isValidObjectId, Types } from 'mongoose';

import connectDB from '@/db/db';
import { type IStyle, Style } from '@/db/models';
import { PromptService } from '@/features/prompt/service';

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

type ServiceError = {
  success: false;
  error: string;
};

type ServiceSuccess<T> = {
  success: true;
  data: T;
};

type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export abstract class StyleService {
  static async createWithEnhancedPrompt(data: {
    userId: string;
    name: string;
    basicPrompt: string;
    geminiApiKey: string;
  }): Promise<ServiceResult<IStyle>> {
    try {
      await connectDB();
    } catch (error) {
      return { success: false, error: toErrorMessage(error, 'Database connection failed') };
    }

    let enhanced: Awaited<ReturnType<typeof PromptService.getExpandedPrompt>>;
    try {
      enhanced = await PromptService.getExpandedPrompt({
        prompt: data.basicPrompt,
        geminiApiKey: data.geminiApiKey,
      });
    } catch (error) {
      return {
        success: false,
        error: `Prompt enhancement failed: ${toErrorMessage(error, 'AI service unavailable')}`,
      };
    }

    try {
      const styleType = (enhanced.blueprint.style.value.trim() || 'custom').slice(0, 100);

      const style = await Style.create({
        userId: data.userId,
        name: data.name,
        basicPrompt: data.basicPrompt,
        extendedPrompt: enhanced.expanded_prompt_text,
        type: styleType,
      });

      return { success: true, data: style };
    } catch (error) {
      if ((error as { code?: number })?.code === 11000) {
        return {
          success: false,
          error: 'A style with this name already exists for this user',
        };
      }
      return {
        success: false,
        error: toErrorMessage(error, 'Failed to save style'),
      };
    }
  }

  static async listByUser(params: {
    userId: string;
    cursor?: string;
    limit?: number;
    query?: string;
  }): Promise<ServiceResult<{ items: IStyle[]; hasNext: boolean; nextCursor: string | null }>> {
    try {
      await connectDB();

      const normalizedLimit = Math.min(Math.max(params.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
      const filter: QueryFilter<IStyle> = { userId: params.userId };
      const trimmedQuery = params.query?.trim();

      if (trimmedQuery) {
        const regex = new RegExp(escapeRegex(trimmedQuery), 'i');
        filter.$or = [{ name: regex }, { type: regex }, { basicPrompt: regex }];
      }

      if (params.cursor) {
        if (!isValidObjectId(params.cursor)) {
          return { success: false, error: 'Invalid pagination cursor' };
        }
        filter._id = { $lt: new Types.ObjectId(params.cursor) };
      }

      const styles = await Style.find(filter)
        .sort({ _id: -1 })
        .limit(normalizedLimit + 1);

      const hasNext = styles.length > normalizedLimit;
      const items = hasNext ? styles.slice(0, normalizedLimit) : styles;
      const nextCursor = hasNext ? String(items[items.length - 1]?._id) : null;

      return {
        success: true,
        data: { items, hasNext, nextCursor },
      };
    } catch (error) {
      return {
        success: false,
        error: toErrorMessage(error, 'Failed to fetch styles'),
      };
    }
  }

  static async findByIdForUser(userId: string, id: string): Promise<ServiceResult<IStyle | null>> {
    try {
      await connectDB();
      const style = await Style.findOne({ _id: id, userId });
      return { success: true, data: style };
    } catch (error) {
      return {
        success: false,
        error: toErrorMessage(error, 'Failed to fetch style'),
      };
    }
  }

  static async toggleSaved(params: {
    userId: string;
    id: string;
    saved: boolean;
  }): Promise<ServiceResult<IStyle | null>> {
    try {
      await connectDB();
      const style = await Style.findOneAndUpdate(
        { _id: params.id, userId: params.userId },
        { isSaved: params.saved },
        { new: true, runValidators: true },
      );
      return { success: true, data: style };
    } catch (error) {
      return {
        success: false,
        error: toErrorMessage(error, 'Failed to update style save status'),
      };
    }
  }

  static async markAsUsed(params: {
    userId: string;
    id: string;
  }): Promise<ServiceResult<{ _id: string; usageCount: number } | null>> {
    try {
      await connectDB();
      const style = await Style.findOneAndUpdate(
        { _id: params.id, userId: params.userId },
        { $inc: { usageCount: 1 } },
        { new: true, projection: { _id: 1, usageCount: 1 } },
      );

      if (!style) return { success: true, data: null };

      return {
        success: true,
        data: { _id: String(style._id), usageCount: style.usageCount },
      };
    } catch (error) {
      return {
        success: false,
        error: toErrorMessage(error, 'Failed to update style usage'),
      };
    }
  }

  static async deleteById(params: { userId: string; id: string }): Promise<ServiceResult<boolean>> {
    try {
      await connectDB();
      const result = await Style.findOneAndDelete({ _id: params.id, userId: params.userId });
      if (!result) return { success: false, error: 'Style not found' };
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: toErrorMessage(error, 'Failed to delete style') };
    }
  }
}
