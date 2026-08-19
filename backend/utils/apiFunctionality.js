class APIFunctionality {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // ==========================================
  // 1. SEARCH
  // ==========================================
  search() {
    if (this.queryStr.keyword) {
      const keywords = this.queryStr.keyword
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const searchConditions = keywords.map((word) => ({
        name: {
          $regex: word,
          $options: "i",
        },
      }));

      this.query = this.query.find({
        $or: searchConditions,
      });
    }

    return this;
  }

  // ==========================================
  // 2. FILTER
  // ==========================================
  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = [
      "keyword",
      "page",
      "limit",
      "sort",
    ];

    removeFields.forEach((key) => delete queryCopy[key]);

    const formattedQuery = {};

    Object.keys(queryCopy).forEach((key) => {
      // price[gte], price[lte], ratings[gte] etc.
      const bracketMatch = key.match(
        /^(.+)\[(gte|gt|lte|lt)\]$/
      );

      if (bracketMatch) {
        const [, field, operator] = bracketMatch;

        if (!formattedQuery[field]) {
          formattedQuery[field] = {};
        }

        formattedQuery[field][`$${operator}`] =
          Number(queryCopy[key]);
      }

      // Nested object
      else if (
        typeof queryCopy[key] === "object" &&
        queryCopy[key] !== null
      ) {
        formattedQuery[key] = {};

        Object.keys(queryCopy[key]).forEach((op) => {
          const cleanOp = op.replace("$", "");

          formattedQuery[key][`$${cleanOp}`] =
            Number(queryCopy[key][op]);
        });
      }

      // Normal field
      else {
        formattedQuery[key] = queryCopy[key];
      }
    });

    this.query = this.query.find(formattedQuery);

    return this;
  }

  // ==========================================
  // 3. SORT
  // ==========================================
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort
        .split(",")
        .join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // ==========================================
  // 4. PAGINATION
  // ==========================================
  pagination(resPerPage) {
    const currentPage =
      Number(this.queryStr.page) || 1;

    const skip =
      resPerPage * (currentPage - 1);

    this.query = this.query
      .limit(resPerPage)
      .skip(skip);

    return this;
  }
}

export default APIFunctionality;