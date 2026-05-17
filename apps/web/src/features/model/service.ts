import connectDB from '@/db/db';
import { Model as AiModel } from '@/db/models';

export abstract class AiModelService {
  static async create(data: { name: string; companyId: string }) {
    try {
      await connectDB();
      const aiModel = await AiModel.create(data);
      return { success: true as const, data: aiModel };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to create model',
      };
    }
  }

  static async findAll() {
    try {
      await connectDB();
      const aiModels = await AiModel.find().sort({ createdAt: -1 });
      return { success: true as const, data: aiModels };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch models',
      };
    }
  }

  static async findById(id: string) {
    try {
      await connectDB();
      const aiModel = await AiModel.findById(id);
      return { success: true as const, data: aiModel };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch model',
      };
    }
  }

  static async update(id: string, data: Partial<{ name: string; companyId: string }>) {
    try {
      await connectDB();
      const aiModel = await AiModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      return { success: true as const, data: aiModel };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to update model',
      };
    }
  }

  static async delete(id: string) {
    try {
      await connectDB();
      await AiModel.findByIdAndDelete(id);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to delete model',
      };
    }
  }
}
