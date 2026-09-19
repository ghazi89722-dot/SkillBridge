import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../config/constants';

export interface IResumeDocument {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  uploadedAt: Date;
}

export interface IUser extends Document {
  role: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  preferredLanguage?: string;
  domainId?: mongoose.Types.ObjectId;
  profile?: any;
  resume?: IResumeDocument;
  isVerifiedAccount: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ResumeSchema = new Schema<IResumeDocument>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    size: {
      type: Number,
      required: true,
      min: 1,
      max: 5 * 1024 * 1024,
    },
    data: {
      type: Buffer,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: 'Domain',
    },
    profile: {
      type: Schema.Types.Mixed,
      default: {},
    },
    resume: {
      type: ResumeSchema,
      default: null,
    },
    isVerifiedAccount: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);
