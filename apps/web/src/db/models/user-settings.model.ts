import mongoose, { type Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: string;
  geminiApiKey: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    geminiApiKey: { type: String, default: null },
  },
  { timestamps: true },
);

export const UserSettings =
  mongoose.models.UserSettings ?? mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
