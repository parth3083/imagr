import connectDB from '@/db/db';
import { Style } from '@/db/models';

export abstract class StyleService {
  static async create(data: {
    name: string;
    styleSystemPrompt: string;
    modelId: string;
    tags?: string[];
  }) {
    try {
      await connectDB();
      const style = await Style.create(data);
      return { success: true as const, data: style };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to create style',
      };
    }
  }

  static async findAll() {
    try {
      await connectDB();
      const styles = await Style.find().sort({ createdAt: -1 });
      return { success: true as const, data: styles };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch styles',
      };
    }
  }

  static async findById(id: string) {
    try {
      await connectDB();
      const style = await Style.findById(id);
      return { success: true as const, data: style };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch style',
      };
    }
  }

  static async update(
    id: string,
    data: Partial<{ name: string; styleSystemPrompt: string; modelId: string; tags: string[] }>,
  ) {
    try {
      await connectDB();
      const style = await Style.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      return { success: true as const, data: style };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to update style',
      };
    }
  }

  static async delete(id: string) {
    try {
      await connectDB();
      await Style.findByIdAndDelete(id);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to delete style',
      };
    }
  }
}
