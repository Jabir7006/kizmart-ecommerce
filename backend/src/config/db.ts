import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(
      `Database connected successfully on host ${mongoose.connection.host}`,
    );
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

export default connectDB;
