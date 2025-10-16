import { Router } from "express";

import {
  createProductSchema,
  productQuerySchema,
} from "../schemas/productSchema.js";
import {
  addNewProduct,
  getAllProducts,
} from "../controllers/ProductController.js";
import { validate } from "../middlewares/validateMiddleware.js";

const productRouter = Router();

productRouter.post(
  "/new",
  validate({ body: createProductSchema }),
  addNewProduct
);
productRouter.get("/", validate({ query: productQuerySchema }), getAllProducts);

export default productRouter;
