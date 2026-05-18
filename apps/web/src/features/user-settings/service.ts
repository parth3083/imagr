import connectDB from '@/db/db';
import { UserSettings } from '@/db/models';

export abstract class UserSettingsService {
  static async getSettings(userId: string): Promise<{ hasApiKey: boolean }> {
    await connectDB();
    const settings = await UserSettings.findOne({ userId });
    return { hasApiKey: !!settings?.geminiApiKey };
  }

  static async saveApiKey(userId: string, apiKey: string): Promise<void> {
    await connectDB();
    await UserSettings.findOneAndUpdate(
      { userId },
      { geminiApiKey: apiKey },
      { upsert: true, new: true },
    );
  }

  static async getApiKey(userId: string): Promise<string | null> {
    await connectDB();
    const settings = await UserSettings.findOne({ userId });
    return settings?.geminiApiKey ?? null;
  }
}
