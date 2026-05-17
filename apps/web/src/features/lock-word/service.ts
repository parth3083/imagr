import connectDB from '@/db/db';
import { LockWord } from '@/db/models';

export abstract class LockWordService {
  static async create(data: { word: string; format: string; styleId: string }) {
    try {
      await connectDB();
      const lockWord = await LockWord.create(data);
      return { success: true as const, data: lockWord };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to create lock word',
      };
    }
  }

  static async findAll() {
    try {
      await connectDB();
      const lockWords = await LockWord.find().sort({ createdAt: -1 });
      return { success: true as const, data: lockWords };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch lock words',
      };
    }
  }

  static async findById(id: string) {
    try {
      await connectDB();
      const lockWord = await LockWord.findById(id);
      return { success: true as const, data: lockWord };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch lock word',
      };
    }
  }

  static async update(
    id: string,
    data: Partial<{ word: string; format: string; styleId: string }>,
  ) {
    try {
      await connectDB();
      const lockWord = await LockWord.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return { success: true as const, data: lockWord };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to update lock word',
      };
    }
  }

  static async delete(id: string) {
    try {
      await connectDB();
      await LockWord.findByIdAndDelete(id);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to delete lock word',
      };
    }
  }
}
