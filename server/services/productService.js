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

const findAllProducts = async (query) => {
  try {
    const { skip, limit, page } = paginationHandler(query);

    const [products, totalProducts] = await Promise.all([
      Product.find().skip(skip).limit(limit).lean().exec(),
      Product.countDocuments().exec(),
    ]);

    if(page > Math.ceil(totalProducts / limit)){
      throw new Error("Page not found");
    }
    if(totalProducts === 0){
      throw new Error("No products found");
    }

    const pagination = calculatePaginationMeta(totalProducts, page, limit);

    return { products, pagination };
  } catch (error) {
    throw error;
  }
};
export { createNewProduct, findAllProducts };
