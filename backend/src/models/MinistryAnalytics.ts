import mongoose, { Schema, Document } from 'mongoose';

export interface IMinistryAnalytics extends Document {
  domainId: mongoose.Types.ObjectId;
  generatedAt: Date;
  byInstitution: Array<{
    institutionId: mongoose.Types.ObjectId;
    avgReadiness: number;
    topGaps: mongoose.Types.ObjectId[];
  }>;
  nationalSkillGapSummary: Array<{
    skillId: mongoose.Types.ObjectId;
    avgScore: number;
  }>;
}

const MinistryAnalyticsSchema = new Schema<IMinistryAnalytics>(
  {
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    byInstitution: [
      {
        institutionId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        avgReadiness: Number,
        topGaps: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Skill',
          },
        ],
      },
    ],
    nationalSkillGapSummary: [
      {
        skillId: {
          type: Schema.Types.ObjectId,
          ref: 'Skill',
        },
        avgScore: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

MinistryAnalyticsSchema.index({ domainId: 1, generatedAt: -1 });

export default mongoose.model<IMinistryAnalytics>('MinistryAnalytics', MinistryAnalyticsSchema);
