import { Schema, model, models, type Document, type Types } from 'mongoose';

export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  website: string;
  openai: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    website: {
      type: String,
      required: [true, 'Website is required'],
      trim: true,
      lowercase: true,
    },
    openai: {
      type: String,
      required: [true, 'OpenAI API key is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'companies',
  },
);

// Indexes for optimization
companySchema.index({ name: 1 });
companySchema.index({ website: 1 });

export const Company = models.Company || model<ICompany>('Company', companySchema);
