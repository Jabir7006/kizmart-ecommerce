import express from 'express';
import {
  handleSignup,
  handleSignin,
  handleVerifyEmail,
} from '../controllers/auth.controller.js';
import { signupSchema, signinSchema, verifyEmailSchema } from '../schemas/auth.schema.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const authRoute = express.Router();

authRoute.post('/signup', validate(signupSchema), handleSignup);
authRoute.post('/signin', validate(signinSchema), handleSignin);
authRoute.post(
  '/verify-email',
  protect,
  validate(verifyEmailSchema),
  handleVerifyEmail,
);

export default authRoute;
