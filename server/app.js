import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(notFound);
app.use(errorHandler);

export default app;
