import { HTTP_STATUS } from '../constants/http.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import VerificationCode from '../models/verificationCode.model.js';
import {
  accessTokenSignOptions,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
  type refreshTokenPayload,
} from '../utils/jwt.js';
import { REFRESH_TOKEN_SECRET } from '../constants/env.js';
import createVerificationCodeAndSendMail from '../utils/createVerificationCodeAndSendMail.js';



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

  const accessToken = signToken(
    { userId: user._id, role: user.role, verified: user.verified },
    accessTokenSignOptions,
  );
  const refreshToken = signToken({ userId: user._id }, refreshTokenSignOptions);
  
   await createVerificationCodeAndSendMail(user._id.toString(), user.email, 'email_verification');

    
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
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { verified: true } },
    { new: true } 
  );

  await VerificationCode.deleteMany({
    user: userId,
    type: 'email_verification',
  });

  return { user: updatedUser };
};

export const resendVerificationEmail = async (userId : string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  if (user.verified) throw new AppError('Email already verified', HTTP_STATUS.BAD_REQUEST);

  await VerificationCode.deleteMany({
    user: userId,
    type: 'email_verification',
  });
   
  await createVerificationCodeAndSendMail(userId, user.email, 'email_verification');
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(
      'User not found with this email. please signup first',
      HTTP_STATUS.NOT_FOUND,
    );
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  const accessToken = signToken(
    { userId: user._id, role: user.role, verified: user.verified },
    accessTokenSignOptions,
  );
  const refreshToken = signToken({ userId: user._id }, refreshTokenSignOptions);

  return { user, accessToken, refreshToken };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, {
    secret: REFRESH_TOKEN_SECRET,
  }) as refreshTokenPayload;

  if (!decoded || !decoded.userId) {
    throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.UNAUTHORIZED);
  }

  const newAccessToken = signToken(
    { userId: user._id, role: user.role, verified: user.verified },
    accessTokenSignOptions,
  );

  return { newAccessToken };
};
