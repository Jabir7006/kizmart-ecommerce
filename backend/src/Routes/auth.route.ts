import express from 'express';
import { handleSignup } from '../controllers/user.controller.js';

const authRoute = express.Router();

authRoute.post('/signup', handleSignup);

export default authRoute;
