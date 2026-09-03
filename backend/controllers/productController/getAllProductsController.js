import Product from "../../models/productModel.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import ErrorHandler from "../../utils/errorHandler.js";

import APIFunctionality from "../../utils/apiFunctionality.js";

// 🔥 Redis
import { getCache, setCache } from "../../utils/redisCache.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const resultsPerPage = 12;

  // =====================================================
  // 🔥 1. CREATE UNIQUE REDIS CACHE KEY
  // =====================================================

  // Query parameters ko stable order me convert karenge
  // taaki same request ki same Redis key bane.

  const sortedQuery = Object.keys(req.query)
    .sort()
    .reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});

  const queryString = new URLSearchParams(
    Object.entries(sortedQuery),
  ).toString();

  const cacheKey = `products:${queryString || "all"}`;

  console.log("🔑 PRODUCT CACHE KEY:", cacheKey);

  // =====================================================
  // ⚡ 2. CHECK REDIS CACHE
  // =====================================================

  const cachedProducts = await getCache(cacheKey);

  if (cachedProducts) {
    console.log("⚡ PRODUCTS SERVED FROM REDIS");

    return res.status(200).json({
      ...cachedProducts,
      fromCache: true,
    });
  }

  console.log("🟡 PRODUCT CACHE MISS → FETCHING FROM MONGODB");

  // =====================================================
  // 3. INITIAL FEATURES
  // Search + Filter + Sort
  // =====================================================

  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter()
    .sort();

  // =====================================================
  // 4. COUNT FILTERED PRODUCTS
  // =====================================================

  const productCount = await Product.countDocuments(
    apiFeatures.query.getFilter(),
  );

  // =====================================================
  // 5. TOTAL PAGES
  // =====================================================

  const totalPages = Math.ceil(productCount / resultsPerPage) || 1;

  const page = Number(req.query.page) || 1;

  // =====================================================
  // 6. INVALID PAGE CHECK
  // =====================================================

  if (page > totalPages && productCount > 0) {
    return next(new ErrorHandler("This page does not exist", 404));
  }

  // =====================================================
  // 7. PAGINATION
  // =====================================================

  apiFeatures.pagination(resultsPerPage);

  // =====================================================
  // 8. FETCH PRODUCTS
  // =====================================================

  const products = await apiFeatures.query;

  // =====================================================
  // 9. RESPONSE DATA
  // =====================================================

  const responseData = {
    success: true,
    products,
    productCount,
    totalPages,
    resultsPerPage,
    currentPage: page,
  };

  // =====================================================
  // 🔥 10. SAVE RESULT IN REDIS
  // TTL = 10 MINUTES
  // =====================================================

  await setCache(cacheKey, responseData, 600);

  console.log("🟢 PRODUCTS SAVED TO REDIS FOR 10 MINUTES");

  // =====================================================
  // 11. SEND RESPONSE
  // =====================================================

  res.status(200).json({
    ...responseData,
    fromCache: false,
  });
});
