import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface IPromptVariant extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  variantPrompt: string;
  negativePrompt: string;
  qualityScore: number;
  voteCount: number;
  isWinner: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promptVariantSchema = new Schema<IPromptVariant>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    variantPrompt: {
      type: String,
      required: [true, 'Variant prompt is required'],
      trim: true,
      maxlength: [2000, 'Variant prompt cannot exceed 2000 characters'],
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
    voteCount: {
      type: Number,
      default: 0,
      min: [0, 'Vote count cannot be negative'],
    },
    isWinner: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'prompt_variants',
  },
);

// Compound indexes for efficient queries
promptVariantSchema.index({ conversationId: 1, qualityScore: -1 });
promptVariantSchema.index({ conversationId: 1, voteCount: -1 });
promptVariantSchema.index({ conversationId: 1, isWinner: 1 });

export const PromptVariant =
  models.PromptVariant || model<IPromptVariant>('PromptVariant', promptVariantSchema);
