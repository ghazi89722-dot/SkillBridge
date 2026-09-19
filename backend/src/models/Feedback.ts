import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  applicationId: mongoose.Types.ObjectId;
  givenById: mongoose.Types.ObjectId;
  ratings: {
    technicalSkills: number;
    communication: number;
    problemSolving: number;
  };
  comments: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    givenById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: {
      technicalSkills: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      communication: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
      problemSolving: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
      },
    },
    comments: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({ applicationId: 1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
