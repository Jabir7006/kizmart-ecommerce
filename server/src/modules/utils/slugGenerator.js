import slugify from "slugify";

// generate slug from title
const generateSlug = (title) => {
  return slugify(title, { lower: true, strict: true });
};

export default generateSlug;
