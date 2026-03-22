import express from 'express';
const uploadRoute = express.Router();

import { upload } from '../middlewares/upload.middleware.js';
import { uploadSingleImage } from '../controllers/upload.controller.js';

uploadRoute.post('/single', upload.single('image'), uploadSingleImage);

export default uploadRoute;
