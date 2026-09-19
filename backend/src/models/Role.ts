import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  domainId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category?: string;
  isActive: boolean;
  requirements: Array<{
    skillId: mongoose.Types.ObjectId;
    minProficiency: number;
  }>;
}

const RoleSchema = new Schema<IRole>(
  {
    domainId: { type: Schema.Types.ObjectId, ref: 'Domain', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    requirements: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
        minProficiency: { type: Number, min: 0, max: 100, required: true },
      },
    ],
  },
  { timestamps: true }
);

RoleSchema.index({ domainId: 1, isActive: 1 });
RoleSchema.index({ domainId: 1, name: 1 }, { unique: true });

export default mongoose.model<IRole>('Role', RoleSchema);
