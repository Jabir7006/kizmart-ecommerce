import { HTTP_STATUS } from '../constants/http.js';
import {
  createUser,
  loginUser,
  refreshUserAccessToken,
  resendVerificationEmail,
  verifyEmail,
} from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js';
import AppError from '../utils/AppError.js';

export const handleSignup = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;

  const { user, accessToken, refreshToken } = await createUser({
    fullName,
    email,
    password,
  });

  setAuthCookies({ res, accessToken, refreshToken });

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message:
      'Account created successfully. Please check your email for the verification code.',
    data: user,
  });
});

export const handleVerifyEmail = catchAsync(async (req, res) => {
  const { code } = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
  }
  const { user } = await verifyEmail(userId, code);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Email verified successfully.',
    data: user,
  });
});

export const handleResendVerificationEmail = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
  }

  await resendVerificationEmail(userId);
   

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Verification email resent successfully.'
  });  
});

export const handleSignin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);

  setAuthCookies({ res, accessToken, refreshToken });

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Login successful.',
    data: user,
  });
});

export const handleSignout = catchAsync(async (_req, res) => {
  clearAuthCookies(res).status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Logout successful',
  });
});

export const handleRefreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    throw new AppError('Missing refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  const { newAccessToken } = await refreshUserAccessToken(refreshToken);

  setAuthCookies({ res, accessToken: newAccessToken });

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Refresh token successful.',
  });
});
