import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category Title is required"],
    },
    slug: {
      type: String,
      required: [true, "Category Slug is required"],
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, "Category Image is required"],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
