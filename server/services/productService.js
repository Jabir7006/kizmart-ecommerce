import Product from "../models/Product.js";
import generateSlug from "../utils/slugGenerator.js";
<<<<<<< HEAD

=======
import paginationHandler, {
  calculatePaginationMeta,
} from "../utils/paginationHandler.js";
>>>>>>> main
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
<<<<<<< HEAD
    const features = new APIFeatures(
      Product.find(),
      query
    )
      .search("title")
      .filter()
      .sort()
      .limitFields()
      .paginate();
=======
    const { skip, limit, page } = paginationHandler(query);
>>>>>>> main

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
