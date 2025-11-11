import Product from "./product.model.js";
import ApiError from "../utils/ApiError.js";
import generateSlug from "../utils/slugGenerator.js";

const createNewProduct = async (data) => {
  try {
    const product = new Product({ ...data, slug: generateSlug(data.title) });
    await product.save();
    return product;
  } catch (error) {
    throw new ApiError(500, "Failed to create product", error.message, false);
  }
};

const findAllProducts = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      brand,
      priceMin,
      priceMax,
      sort,
      fields,
    } = query;

    const pipeline = [];
    const matchStage = {};

    // --- SEARCH STAGE ---
    if (search) {
      pipeline.push({
        $search: {
          index: "products_search",
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "title",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "description",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      });
    }

    // --- FILTER STAGE ---
    if (category) matchStage.category = category;
    if (brand) matchStage.brand = brand;

    if (priceMin || priceMax) {
      matchStage.price = {};
      if (priceMin) matchStage.price.$gte = Number(priceMin);
      if (priceMax) matchStage.price.$lte = Number(priceMax);
    }
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage,
      });
    }

    // --- SORT STAGE ---

    const sortStage = {};

    if (search) {
      pipeline.push({
        $addFields: {
          score: { $meta: "searchScore" },
        },
      });

      if (!sort) {
        sortStage.score = -1;
      }
    }

    if (sort) {
      const [field, dir] = sort.split(":");
      sortStage[field] = dir === "asc" ? 1 : -1;

      if (search && field !== "score") {
        sortStage.score = -1;
      }
    }

    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // --- PAGINATION STAGE ---
    const pageNum = Math.max(1, Number(page));
    const pageLimit = Math.min(100, Number(limit));
    const skip = (pageNum - 1) * pageLimit;

    pipeline.push({
      $facet: {
        metadata: [{ $count: "totalProducts" }],
        data: [
          { $skip: skip },
          { $limit: pageLimit },

          ...(fields
            ? [
                {
                  $project: fields
                    .split(",")
                    .reduce((acc, f) => ({ ...acc, [f.trim()]: 1 }), {}),
                },
              ]
            : []),
        ],
      },
    });

    const result = await Product.aggregate(pipeline);

    const totalProducts = result[0]?.metadata[0]?.totalProducts || 0;
    const products = result[0]?.data || [];
    const totalPages = Math.ceil(totalProducts / parseInt(pageLimit));

    return {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        limit: pageLimit,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };
  } catch (error) {
    throw new ApiError(500, "Failed to find products", error.message, false);
  }
};
export { createNewProduct, findAllProducts };
