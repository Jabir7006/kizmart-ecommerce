import { Schema, model, Document, Types } from 'mongoose';
import { compareValue, hashValue } from '../utils/bcypt.js';

export interface IVerificationCode extends Document {
  user: Types.ObjectId;
  code: string;
  type: 'email_verification' | 'password_reset';
  createdAt: Date;
  expiresAt: Date;
  isCodeValid(code: string): Promise<boolean>;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['email_verification', 'password_reset'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

verificationCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 });

verificationCodeSchema.pre('save', async function () {
  if (!this.isModified('code')) return;

  this.code = await hashValue(this.code);
});

verificationCodeSchema.methods.isCodeValid = function (code: string) {
  return compareValue(code, this.code);
};

export default model<IVerificationCode>(
  'VerificationCode',
  verificationCodeSchema,
  'verification_codes',
);
