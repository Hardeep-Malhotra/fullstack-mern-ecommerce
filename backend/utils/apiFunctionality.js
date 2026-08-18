// class APIFunctionality {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   // 1. Search Method (Name par Case-Insensitive Regex Search)
//   search() {
//     const keyword = this.queryStr.keyword
//       ? {
//           name: {
//             $regex: this.queryStr.keyword,
//             $options: "i",
//           },
//         }
//       : {};

//     this.query = this.query.find({ ...keyword });
//     return this;
//   }

//   // 2. Filter Method (Category, Price Range gte/lte, Ratings)
//   filter() {
//     const queryCopy = { ...this.queryStr };

//     // Unwanted fields delete karo jo filter condition nahi hain
//     const removeFields = ["keyword", "page", "limit", "sort"];
//     removeFields.forEach((key) => delete queryCopy[key]);

//     // Express query ko Mongo Operators ($gte, $lte, $gt, $lt) me transform karna
//     let queryStr = JSON.stringify(queryCopy);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (key) => `$${key}`);

//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   // 3. Sorting Method (Newest First, Price Low to High, Price High to Low)
//   sort() {
//     if (this.queryStr.sort) {
//       // Multiple fields support (e.g. sort=price,ratings -> "price ratings")
//       const sortBy = this.queryStr.sort.split(",").join(" ");
//       this.query = this.query.sort(sortBy);
//     } else {
//       // Default: Latest created items pehle aayenge
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }

//   // 4. Pagination Method (Skip and Limit logic)
//   pagination(resPerPage) {
//     const currentPage = Number(this.queryStr.page) || 1;
//     const skip = resPerPage * (currentPage - 1);

//     this.query = this.query.limit(resPerPage).skip(skip);
//     return this;
//   }
// }

// export default APIFunctionality;
class APIFunctionality {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 1. Search Method
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // 2. Filter Method (Fixed for Numbers, Bracket syntax & Regex operators)
  filter() {
    const queryCopy = { ...this.queryStr };

    // Unwanted fields remove karo
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((key) => delete queryCopy[key]);

    const formattedQuery = {};

    Object.keys(queryCopy).forEach((key) => {
      // Bracket notation handle karne ke liye (e.g. price[gte]=500)
      const bracketMatch = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

      if (bracketMatch) {
        const [, field, operator] = bracketMatch;
        if (!formattedQuery[field]) formattedQuery[field] = {};
        
        // String to Number convert karna zaroori hai
        formattedQuery[field][`$${operator}`] = Number(queryCopy[key]);
      } else if (typeof queryCopy[key] === "object" && queryCopy[key] !== null) {
        // Express nested object handle karne ke liye (e.g. price: { gte: 500 })
        formattedQuery[key] = {};
        Object.keys(queryCopy[key]).forEach((op) => {
          const cleanOp = op.replace("$", "");
          formattedQuery[key][`$${cleanOp}`] = Number(queryCopy[key][op]);
        });
      } else {
        // Normal fields (e.g. category="Electronics")
        formattedQuery[key] = queryCopy[key];
      }
    });

    this.query = this.query.find(formattedQuery);
    return this;
  }

  // 3. Sorting Method
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // 4. Pagination Method
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFunctionality;