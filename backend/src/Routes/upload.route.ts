import express from 'express';
const uploadRoute = express.Router();

import { upload } from '../middlewares/upload.middleware.js';
import {
  uploadMultipleImage,
  uploadSingleImage,
} from '../controllers/upload.controller.js';

uploadRoute.post('/single', upload.single('image'), uploadSingleImage);
uploadRoute.post('/multiple', upload.array('images', 10), uploadMultipleImage);

export default uploadRoute;
