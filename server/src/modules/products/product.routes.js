import { Router } from "express";

import {
  createProductSchema,
  productQuerySchema,
} from "./product.schema.js";
import {
  addNewProduct,
  getAllProducts,
} from "./product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const productRouter = Router();

productRouter.post(
  "/new",
  validate({ body: createProductSchema }),
  addNewProduct
);
productRouter.get("/", validate({ query: productQuerySchema }), getAllProducts);

export default productRouter;
