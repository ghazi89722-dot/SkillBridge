import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillCategory extends Document {
  domainId: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

const SkillCategorySchema = new Schema<ISkillCategory>(
  {
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SkillCategorySchema.index({ domainId: 1 });

export default mongoose.model<ISkillCategory>('SkillCategory', SkillCategorySchema);
