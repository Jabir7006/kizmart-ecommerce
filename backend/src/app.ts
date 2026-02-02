import express from 'express';
import cors from 'cors';
import { APP_ORIGIN } from './constants/env.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);

export default app;
