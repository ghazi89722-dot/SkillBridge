import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningResource extends Document {
  skillId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'practice_project';
  estimatedHours: number;
}

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['article', 'video', 'course', 'practice_project'],
      required: true,
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

LearningResourceSchema.index({ skillId: 1 });

export default mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
