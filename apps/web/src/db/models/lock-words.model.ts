import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface ILockWord extends Document {
  _id: Types.ObjectId;
  word: string;
  format: string;
  styleId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lockWordSchema = new Schema<ILockWord>(
  {
    word: {
      type: String,
      required: [true, 'Lock word is required'],
      trim: true,
      maxlength: [100, 'Lock word cannot exceed 100 characters'],
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
      trim: true,
      maxlength: [200, 'Format cannot exceed 200 characters'],
    },
    styleId: {
      type: Schema.Types.ObjectId,
      ref: 'Style',
      required: [true, 'Style ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'lock_words',
  },
);

// Compound index for efficient queries
lockWordSchema.index({ styleId: 1, word: 1 });

export const LockWord = models.LockWord || model<ILockWord>('LockWord', lockWordSchema);
