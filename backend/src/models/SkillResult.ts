import mongoose, { Schema, Document } from 'mongoose';
import { SkillStatus, VerificationSource } from '../config/constants';

export interface ISkillResult extends Document {
  studentId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  status: string;
  score: number;
  verificationSource: string;
  lastAssessedAt?: Date;
  history: Array<{
    score: number;
    status: string;
    assessedAt: Date;
  }>;
}

const SkillResultSchema = new Schema<ISkillResult>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SkillStatus),
      default: SkillStatus.CLAIMED,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    verificationSource: {
      type: String,
      enum: Object.values(VerificationSource),
      default: VerificationSource.SELF_DECLARED,
    },
    lastAssessedAt: {
      type: Date,
    },
    history: [
      {
        score: Number,
        status: String,
        assessedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index - one skill result per student per skill
SkillResultSchema.index({ studentId: 1, skillId: 1 }, { unique: true });

export default mongoose.model<ISkillResult>('SkillResult', SkillResultSchema);
