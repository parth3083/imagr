import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface IStyle extends Document {
  _id: Types.ObjectId;
  userId: string;
  name: string;
  type: string;
  basicPrompt: string;
  extendedPrompt: string;
  isSaved: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const styleSchema = new Schema<IStyle>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Style name is required'],
      trim: true,
      maxlength: [100, 'Style name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Style type is required'],
      trim: true,
      maxlength: [100, 'Style type cannot exceed 100 characters'],
      default: 'custom',
    },
    basicPrompt: {
      type: String,
      required: [true, 'Basic prompt is required'],
      trim: true,
    },
    extendedPrompt: {
      type: String,
      required: [true, 'Extended prompt is required'],
      trim: true,
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Usage count cannot be negative'],
    },
  },
  {
    timestamps: true,
    collection: 'styles',
  },
);

// Indexes for efficient queries
styleSchema.index({ userId: 1, createdAt: -1 });
styleSchema.index({ userId: 1, name: 1 }, { unique: true });
styleSchema.index({ userId: 1, isSaved: 1, createdAt: -1 });

export const Style = models.Style || model<IStyle>('Style', styleSchema);
