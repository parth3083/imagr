import connectDB from '@/db/db';
import { Company } from '@/db/models';

export abstract class CompanyService {
  static async create(data: { name: string; website: string }) {
    try {
      await connectDB();
      const company = await Company.create(data);
      return { success: true as const, data: company };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to create company',
      };
    }
  }

  static async findAll() {
    try {
      await connectDB();
      const companies = await Company.find().sort({ createdAt: -1 });
      return { success: true as const, data: companies };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch companies',
      };
    }
  }

  static async findById(id: string) {
    try {
      await connectDB();
      const company = await Company.findById(id);
      return { success: true as const, data: company };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to fetch company',
      };
    }
  }

  static async update(id: string, data: Partial<{ name: string; website: string }>) {
    try {
      await connectDB();
      const company = await Company.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return { success: true as const, data: company };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to update company',
      };
    }
  }

  static async delete(id: string) {
    try {
      await connectDB();
      await Company.findByIdAndDelete(id);
      return { success: true as const };
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Failed to delete company',
      };
    }
  }
}
