import express from 'express';
import { handleGetUser } from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.get('/profile', handleGetUser);

export default userRoute;
