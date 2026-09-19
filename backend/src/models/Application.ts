import mongoose, { Schema, Document } from 'mongoose';
import { ApplicationStatus } from '../config/constants';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  status: string;
  matchResultSnapshot?: any;
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
    },
    matchResultSnapshot: {
      type: Schema.Types.Mixed,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ApplicationSchema.index({ studentId: 1, opportunityId: 1 }, { unique: true });
ApplicationSchema.index({ opportunityId: 1, status: 1 });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
