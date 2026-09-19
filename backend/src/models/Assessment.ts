import mongoose, { Schema, Document } from 'mongoose';
import { AssessmentType } from '../config/constants';

export interface IAssessmentQuestion {
  _id: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface IAssessment extends Document {
  skillId: mongoose.Types.ObjectId;
  type: string;
  questions: IAssessmentQuestion[];
  rubricCriteria?: Array<{
    criterion: string;
    maxScore: number;
  }>;
  durationMinutes: number;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(AssessmentType),
      default: AssessmentType.MCQ,
    },
    questions: [
      {
        text: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          required: true,
        },
        correctOptionIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    rubricCriteria: [
      {
        criterion: String,
        maxScore: Number,
      },
    ],
    durationMinutes: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

AssessmentSchema.index({ skillId: 1 });

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);
