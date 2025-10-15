import { createNewProduct } from "../services/productService.js";

const addNewProduct = async (req, res, next) => {
  try {
    const validatedData = req.validated.body;

    const product = await createNewProduct(validatedData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export { addNewProduct };
