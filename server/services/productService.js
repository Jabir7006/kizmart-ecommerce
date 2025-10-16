import Product from "../models/Product.js";
import APIFeatures from "../utils/apiFeatures.js";
import generateSlug from "../utils/slugGenerator.js";
import Category from "../models/Category.js";
const createNewProduct = async (data) => {
  try {
    const product = new Product({ ...data, slug: generateSlug(data.title) });
    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};
const findAllProducts = async (query) => {
  try {
    const features = new APIFeatures(
      Product.find().populate("category", "title"),
      query
    )
      .search("title")
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const totalProducts = await features.getCount(Product);
    return {
      total: totalProducts,
      results: products.length,
      currentPage: features.page,
      totalPages: Math.ceil(totalProducts / features.limit),
      hasNextPage: features.page < Math.ceil(totalProducts / features.limit),
      hasPreviousPage: features.page > 1,
      data: products,
    };
  } catch (error) {
    throw error;
  }
};
export { createNewProduct, findAllProducts };
