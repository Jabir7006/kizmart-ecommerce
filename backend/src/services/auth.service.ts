import { HTTP_STATUS } from '../constants/http.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import VerificationCode from '../models/verificationCode.model.js';
import {
  accessTokenSignOptions,
  refreshTokenSignOptions,
  signToken,
} from '../utils/jwt.js';
import sendMail from '../utils/sendMail.js';
import { getEmailVerificationTemplate } from '../utils/mailTemplates.js';

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

type CreateUserData = {
  fullName: string;
  email: string;
  password: string;
};

export const createUser = async (data: CreateUserData) => {
  const existsUser = await User.findOne({ email: data.email });
  if (existsUser) {
    throw new AppError('User already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create(data);

  const verificationCode = generateVerificationCode();
  await VerificationCode.create({
    user: user._id,
    code: verificationCode,
    type: 'email_verification',
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  const accessToken = signToken(
    { userId: user._id, role: user.role },
    accessTokenSignOptions,
  );
  const refreshToken = signToken({ userId: user._id }, refreshTokenSignOptions);

  const { subject, text, html } =
    getEmailVerificationTemplate(verificationCode);
  await sendMail({ to: user.email, subject, text, html });
  return { user, accessToken, refreshToken };
};

export const verifyEmail = async (userId: string, code: string) => {
  const verificationCode = await VerificationCode.findOne({
    user: userId,
    type: 'email_verification',
  });

  if (!verificationCode) {
    throw new AppError(
      'Invalid or expired verification code',
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const isValid = await verificationCode.isCodeValid(code);
  if (!isValid) {
    throw new AppError('Invalid verification code', HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (user.verified) {
    throw new AppError('Email already verified', HTTP_STATUS.BAD_REQUEST);
  }

  user.verified = true;
  await user.save();

  await VerificationCode.deleteMany({
    user: userId,
    type: 'email_verification',
  });

  return { user };
};
