import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface IStyle extends Document {
  _id: Types.ObjectId;
  name: string;
  styleSystemPrompt: string;
  modelId: Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const styleSchema = new Schema<IStyle>(
  {
    name: {
      type: String,
      required: [true, 'Style name is required'],
      trim: true,
      maxlength: [100, 'Style name cannot exceed 100 characters'],
    },
    styleSystemPrompt: {
      type: String,
      required: [true, 'Style system prompt is required'],
      trim: true,
      maxlength: [2000, 'Style system prompt cannot exceed 2000 characters'],
    },
    modelId: {
      type: Schema.Types.ObjectId,
      ref: 'Model',
      required: [true, 'Model ID is required'],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.every((tag: string) => tag.length <= 50);
        },
        message: 'Each tag cannot exceed 50 characters',
      },
    },
  },
  {
    timestamps: true,
    collection: 'styles',
  },
);

// Compound indexes for efficient queries
styleSchema.index({ modelId: 1, name: 1 });
styleSchema.index({ tags: 1 });

export const Style = models.Style || model<IStyle>('Style', styleSchema);
