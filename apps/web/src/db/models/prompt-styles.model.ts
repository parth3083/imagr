import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface IPromptStyle extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const promptStyleSchema = new Schema<IPromptStyle>(
  {
    name: {
      type: String,
      required: [true, 'Prompt style name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Prompt style name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'prompt_styles',
  },
);

// Index for efficient name lookups
promptStyleSchema.index({ name: 1 });

export const PromptStyle =
  models.PromptStyle || model<IPromptStyle>('PromptStyle', promptStyleSchema);
