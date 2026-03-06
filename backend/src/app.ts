import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { APP_ORIGIN } from './constants/env.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.js';
import authRoute from './Routes/auth.route.js';
import { protect } from './middlewares/auth.middleware.js';
import userRoute from './Routes/user.route.js';
import productRoute from './Routes/product.route.js';
import categoryRoute from './Routes/category.route.js';
import brandRoute from './Routes/brand.route.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);

//routes
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
  });
});
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', protect, userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/brands', brandRoute);

app.use(notFoundHandler);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;
