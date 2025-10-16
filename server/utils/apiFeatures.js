class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.excludedFields = ["page", "sort", "limit", "fields", "search"];
    this.filteredQueryObj = null; 
  }

  getFilteredQueryObj() {
    if (this.filteredQueryObj) {
      return this.filteredQueryObj;
    }

    const queryObj = { ...this.queryString };
    this.excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`
    );

    this.filteredQueryObj = JSON.parse(queryStr);
    return this.filteredQueryObj;
  }

  filter() {
    this.query = this.query.find(this.getFilteredQueryObj());
    return this;
  }

  // 2. Text Search
  search(...fields) {
    const keyword = this.queryString.search;
    if (keyword && fields.length) {
      const searchQuery = {
        $or: fields.map((field) => ({
          [field]: { $regex: keyword, $options: "i" },
        })),
      };
      this.query = this.query.find(searchQuery);
    }
    return this;
  }

  // 3. Sorting
  sort() {
    if (this.queryString.sort) {
      // e.g., ?sort=price,-ratingsAverage
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by newest
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // 4. Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // 5. Pagination
  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit) || 20);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;

    return this;
  }

  // 6. Count total results for frontend pagination UI
  async getCount(model) {
    const count = await model.countDocuments(this.getFilteredQueryObj());
    return count;
  }
}

export default APIFeatures;
