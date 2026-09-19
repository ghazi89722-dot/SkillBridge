import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentAttempt extends Document {
  studentId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  answers: Array<{
    questionId: string;
    selectedOptionIndex: number;
  }>;
  rawScore: number;
  normalizedScore: number;
  submittedAt: Date;
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        selectedOptionIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    rawScore: {
      type: Number,
      required: true,
      min: 0,
    },
    normalizedScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

AssessmentAttemptSchema.index({ studentId: 1, assessmentId: 1, submittedAt: -1 });

export default mongoose.model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema);
