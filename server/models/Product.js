import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Product Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title must be less than 100 characters long"],
    },

    slug: {
      type: String,
      required: [true, "Product Slug is required"],
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product Description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
    },

    price: {
      type: Number,
      required: [true, "Product Price is required"],
      min: [0, "Price must be greater than 0"],
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    discount: {
      type: Number,
      min: [0, "Discount must be greater than 0"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, "Product Image is required"],
        },
        url: {
          type: String,
          required: [true, "Product Image URL is required"],
        },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product Category is required"],
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: "no brand",
    },
    // variants: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Variant",
    //     default: "no variant",
    //   },
    // ],
    // attributes: {
    //   type: Map,
    //   of: String,
    // },
    quantity: {
      type: Number,
      required: [true, "Product Quantity is required"],
      default: 0,
    },
    stockStatus: {
      type: String,
      enum: ["in stock", "out of stock", "low stock"],
      default: "in stock",
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
productSchema.index({
  title: 1,
  price: 1, 
  category: 1,
  brand: 1,
  stockStatus: 1,
  isFeatured: 1,
});
const Product = model("Product", productSchema);

export default Product;
