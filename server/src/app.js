import express from "express";
import { errorHandler, notFound } from "./modules/middlewares/error.middleware.js";
import productRoutes from "./modules/products/product.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
