import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  domainId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  proficiencyScale: {
    beginner: [number, number];
    developing: [number, number];
    intermediate: [number, number];
    advanced: [number, number];
    expert: [number, number];
  };
  curriculumReference: string | null;
  assessmentTypesSupported: string[];
}

const SkillSchema = new Schema<ISkill>(
  {
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SkillCategory',
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
    proficiencyScale: {
      beginner: {
        type: [Number],
        default: [0, 39],
      },
      developing: {
        type: [Number],
        default: [40, 59],
      },
      intermediate: {
        type: [Number],
        default: [60, 74],
      },
      advanced: {
        type: [Number],
        default: [75, 89],
      },
      expert: {
        type: [Number],
        default: [90, 100],
      },
    },
    curriculumReference: {
      type: String,
      default: null,
    },
    assessmentTypesSupported: {
      type: [String],
      default: ['mcq'],
    },
  },
  {
    timestamps: true,
  }
);

SkillSchema.index({ domainId: 1 });
SkillSchema.index({ categoryId: 1 });

export default mongoose.model<ISkill>('Skill', SkillSchema);
