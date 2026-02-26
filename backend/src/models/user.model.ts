import { Document, Schema, model } from 'mongoose';
import { compareValue, hashValue } from '../utils/bcypt.js';

export const ROLES = ['user', 'manager', 'admin'] as const;

export type Role = (typeof ROLES)[number];

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      min : [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'user',
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: function (_doc, ret, _options) {
    delete (ret as Partial<IUser>).password;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (ret as any).__v;
    return ret;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashValue(this.password);
});

userSchema.methods.comparePassword = async function (password: string) {
  return await compareValue(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
