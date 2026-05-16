import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface IConversation extends Document {
  _id: Types.ObjectId;
  userId: string;
  modelId: Types.ObjectId;
  promptStyleId: Types.ObjectId;
  styleId: Types.ObjectId;
  inputPrompt: string;
  outputPrompt: string;
  negativePrompt: string;
  qualityScore: number;
  hotWarning: string;
  errorWarning: string;
  appleImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    modelId: {
      type: Schema.Types.ObjectId,
      ref: 'Model',
      required: [true, 'Model ID is required'],
      index: true,
    },
    promptStyleId: {
      type: Schema.Types.ObjectId,
      ref: 'PromptStyle',
      required: [true, 'Prompt Style ID is required'],
      index: true,
    },
    styleId: {
      type: Schema.Types.ObjectId,
      ref: 'Style',
      required: [true, 'Style ID is required'],
      index: true,
    },
    inputPrompt: {
      type: String,
      required: [true, 'Input prompt is required'],
      trim: true,
      maxlength: [2000, 'Input prompt cannot exceed 2000 characters'],
    },
    outputPrompt: {
      type: String,
      required: [true, 'Output prompt is required'],
      trim: true,
      maxlength: [2000, 'Output prompt cannot exceed 2000 characters'],
    },
    negativePrompt: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Negative prompt cannot exceed 1000 characters'],
    },
    qualityScore: {
      type: Number,
      required: [true, 'Quality score is required'],
      min: [0, 'Quality score must be at least 0'],
      max: [100, 'Quality score cannot exceed 100'],
      default: 50,
    },
    hotWarning: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Hot warning cannot exceed 500 characters'],
    },
    errorWarning: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Error warning cannot exceed 500 characters'],
    },
    appleImage: {
      type: String,
      required: [true, 'Apple image URL is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'conversations',
  },
);

// Compound indexes for efficient queries
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ modelId: 1, styleId: 1 });
conversationSchema.index({ qualityScore: -1 });

export const Conversation =
  models.Conversation || model<IConversation>('Conversation', conversationSchema);
