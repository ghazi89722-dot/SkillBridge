import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationOpportunity extends Document {
  postedById: mongoose.Types.ObjectId;
  type: 'fdp' | 'guest_lecture' | 'mentorship' | 'research' | 'live_project';
  title: string;
  description: string;
  domainId: mongoose.Types.ObjectId;
  status: 'open' | 'closed';
  interestedAcademicianIds: mongoose.Types.ObjectId[];
}

const CollaborationOpportunitySchema = new Schema<ICollaborationOpportunity>(
  {
    postedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['fdp', 'guest_lecture', 'mentorship', 'research', 'live_project'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    interestedAcademicianIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

CollaborationOpportunitySchema.index({ domainId: 1, status: 1 });

export default mongoose.model<ICollaborationOpportunity>(
  'CollaborationOpportunity',
  CollaborationOpportunitySchema
);
