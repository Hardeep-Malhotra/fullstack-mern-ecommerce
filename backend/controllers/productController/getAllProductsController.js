
import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";
import APIFunctionality from "../../utils/apiFunctionality.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const resultsPerPage = 12;

  // 1. Initial Features (Search, Filter, Sort)
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter()
    .sort();

  // 2. Count Total Filtered Products safely
  const productCount = await Product.countDocuments(apiFeatures.query.getFilter());

  // 3. Total pages calculate kiye
  const totalPages = Math.ceil(productCount / resultsPerPage) || 1;
  const page = Number(req.query.page) || 1;

  // 4. Invalid page check
  if (page > totalPages && productCount > 0) {
    return next(new ErrorHandler("This page does not exist", 404));
  }

  // 5. Apply Pagination
  apiFeatures.pagination(resultsPerPage);

  // 6. Final Products Fetch
  const products = await apiFeatures.query;

  // 7. Response
  res.status(200).json({
    success: true,
    products,
    productCount,
    totalPages,
    resultsPerPage,
    currentPage: page,
  });
});