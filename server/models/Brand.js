import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Brand Title is required"],
		},
		slug: {
			type: String,
			required: [true, "Brand Slug is required"],
			unique: true,
			lowercase: true,
		},
	},
	{ timestamps: true },
);

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
