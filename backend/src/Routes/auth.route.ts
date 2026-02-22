import express from 'express';
import { handleSignup } from '../controllers/auth.controller.js';
import { signupSchema } from '../schemas/auth.schema.js';
import validate from '../middlewares/validate.middleware.js';

const authRoute = express.Router();

authRoute.post('/signup', validate(signupSchema), handleSignup);

export default authRoute;
