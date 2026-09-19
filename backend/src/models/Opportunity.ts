import mongoose, { Schema, Document } from 'mongoose';
import { OpportunityType } from '../config/constants';

export interface IOpportunity extends Document {
  industryId: mongoose.Types.ObjectId;
  domainId: mongoose.Types.ObjectId;
  roleId?: mongoose.Types.ObjectId;
  title: string;
  type: string;
  description: string;
  eligibility?: string;
  requiredSkills: Array<{
    skillId: mongoose.Types.ObjectId;
    minProficiency: number;
  }>;
  location?: string;
  isRemote: boolean;
  durationWeeks?: number;
  status: 'open' | 'closed';
  createdAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    industryId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(OpportunityType),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
    },
    requiredSkills: [
      {
        skillId: {
          type: Schema.Types.ObjectId,
          ref: 'Skill',
          required: true,
        },
        minProficiency: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
      },
    ],
    location: {
      type: String,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    durationWeeks: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

OpportunitySchema.index({ domainId: 1, status: 1 });
OpportunitySchema.index({ industryId: 1 });

export default mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
