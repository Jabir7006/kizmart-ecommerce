import Product from "../models/Product.js";
import generateSlug from "../utils/slugGenerator.js";

const createNewProduct = async (data) => {
  try {
    const product = new Product({ ...data, slug: generateSlug(data.title) });
    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};

export { createNewProduct };
