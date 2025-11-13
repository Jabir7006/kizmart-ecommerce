import { createNewProduct, findAllProducts } from "./product.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// @access  Public
const addNewProduct = asyncHandler(async (req, res) => {
  const validatedData = req.validated.body;

  const product = await createNewProduct(validatedData);

  res.status(201).json(
    new ApiResponse(201, "Product created successfully", {
      product,
    })
  );
});

// @route   GET /api/v1/products
// @desc    Get all products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  const validatedData = req.validated.query;

  const { products, pagination } = await findAllProducts(validatedData);

  res.status(200).json(
    new ApiResponse(200, "Products retrieved successfully", {
      pagination,
      products,
    })
  );
});
export { addNewProduct, getAllProducts };
