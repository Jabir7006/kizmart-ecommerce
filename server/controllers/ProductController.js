// @route   POST /api/v1/products
// @desc    Add a new product

import {
  createNewProduct,
  findAllProducts,
} from "../services/productService.js";

// @access  Public
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

// @route   GET /api/v1/products
// @desc    Get all products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const validatedData = req.validated.query;
console.log(validatedData);

    const { products, pagination } = await findAllProducts(validatedData);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      pagination,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
export { addNewProduct, getAllProducts };
