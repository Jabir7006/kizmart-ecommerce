import express from 'express';
import {
  handleGetCurrentUser,
  handleSignup,
  handleSignin,
  handleVerifyEmail,
  handleSignout,
  handleRefreshToken,
  handleResendVerificationEmail,
} from '../controllers/auth.controller.js';
import {
  signupSchema,
  signinSchema,
  verifyEmailSchema,
} from '../schemas/auth.schema.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const authRoute = express.Router();

authRoute.get('/me', protect, handleGetCurrentUser);
authRoute.post('/signup', validate(signupSchema), handleSignup);
authRoute.post('/signin', validate(signinSchema), handleSignin);
authRoute.post(
  '/verify-email',
  protect,
  validate(verifyEmailSchema),
  handleVerifyEmail,
);
authRoute.post(
  '/resend-verification-email',
  protect,
  handleResendVerificationEmail,
);
authRoute.post('/signout', handleSignout);
authRoute.post('/refresh', handleRefreshToken);

export default authRoute;
