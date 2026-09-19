import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitutionAnalytics extends Document {
  institutionId: mongoose.Types.ObjectId;
  domainId: mongoose.Types.ObjectId;
  generatedAt: Date;
  totalStudents: number;
  avgReadiness: number;
  skillGapSummary: Array<{
    skillId: mongoose.Types.ObjectId;
    avgScore: number;
    gapCount: number;
  }>;
}

const InstitutionAnalyticsSchema = new Schema<IInstitutionAnalytics>(
  {
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    avgReadiness: {
      type: Number,
      default: 0,
    },
    skillGapSummary: [
      {
        skillId: {
          type: Schema.Types.ObjectId,
          ref: 'Skill',
        },
        avgScore: Number,
        gapCount: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

InstitutionAnalyticsSchema.index({ institutionId: 1, domainId: 1 });

export default mongoose.model<IInstitutionAnalytics>(
  'InstitutionAnalytics',
  InstitutionAnalyticsSchema
);
