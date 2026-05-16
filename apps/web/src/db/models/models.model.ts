import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface IModel extends Document {
  _id: Types.ObjectId;
  name: string;
  companyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const modelSchema = new Schema<IModel>(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
      maxlength: [100, 'Model name cannot exceed 100 characters'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'models',
  },
);

// Compound index for efficient queries
modelSchema.index({ companyId: 1, name: 1 });

export const Model = models.Model || model<IModel>('Model', modelSchema);
