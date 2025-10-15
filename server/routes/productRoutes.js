import { Router } from "express";

import { createProductSchema } from "../schemas/productSchema.js";
import { addNewProduct } from "../controllers/ProductController.js";
import { validate } from "../middlewares/validateMiddleware.js";

const productRouter = Router();

productRouter.post("/new", validate({ body: createProductSchema }), addNewProduct);

export default productRouter;
