import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // REDUX
  const {
    products,
    loading,
    error,
    productCount,
    totalPages,
    currentPage,
  } = useSelector((state) => state.product);

  // URL VALUES
  const urlKeyword = searchParams.get("keyword") || "";
  const urlCategory = searchParams.get("category") || "";

  // FILTER STATES
  const [category, setCategory] = useState(urlCategory);
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);

  const [rating, setRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  // Sync state during render when urlCategory changes
  if (prevUrlCategory !== urlCategory) {
    setPrevUrlCategory(urlCategory);
    setCategory(urlCategory);
  }

  const categories = [
    "Electronics",
    "Fashion",
    "Footwear",
    "Accessories",
    "Beauty",
    "Gaming",
    "Home",
  ];

  // ==========================================
  // HELPER: BUILD PARAMS
  // ==========================================
  const buildQueryParams = (page = 1) => {
    const params = {
      page,
      keyword: urlKeyword,
    };

    if (category) params.category = category;
    if (rating) params["ratings[gte]"] = rating;
    if (sort) params.sort = sort;

    // Only add price filter if value is provided
    if (minPrice !== "" && minPrice !== null) {
      params["price[gte]"] = Number(minPrice);
    }
    if (maxPrice !== "" && maxPrice !== null) {
      params["price[lte]"] = Number(maxPrice);
    }

    return params;
  };

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================
  const fetchProducts = (page = 1) => {
    const params = buildQueryParams(page);
    dispatch(getProducts(params));
  };

  // ==========================================
  // INITIAL / URL SEARCH FETCH
  // ==========================================
  useEffect(() => {
    fetchProducts(1);
  }, [urlKeyword, urlCategory]);

  // APPLY FILTERS
  const handleApplyFilters = () => {
    fetchProducts(1);
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setCategory("");
    setRating("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");

    const params = {};
    if (urlKeyword) params.keyword = urlKeyword;

    setSearchParams(params);
    dispatch(getProducts({ page: 1, keyword: urlKeyword }));
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);

    const params = buildQueryParams(1);
    params.sort = value;

    dispatch(getProducts(params));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-red-500">{error}</p>
          <button
            onClick={() => fetchProducts(1)}
            className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {urlKeyword ? `Search results for "${urlKeyword}"` : "Explore our latest products"}
          </p>
          {productCount > 0 && (
            <p className="mt-1 text-xs text-slate-400">{productCount} products found</p>
          )}
        </div>

        {/* SORT */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-500 whitespace-nowrap">Sort by:</label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Latest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings">Highest Rated</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* SIDEBAR */}
        <aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Filters</h2>
            <button
              onClick={handleClearFilters}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Clear All
            </button>
          </div>

          {/* CATEGORY */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-800">Category</h3>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={category === ""}
                  onChange={() => handleCategoryChange("")}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-slate-600">All Categories</span>
              </label>

              {categories.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={item}
                    checked={category === item}
                    onChange={() => handleCategoryChange(item)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-slate-600">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* RATING */}
          <div className="mt-7 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Rating</h3>
            <div className="mt-3 space-y-2">
              {[4, 3, 2, 1].map((value) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === String(value)}
                    onChange={() => setRating(String(value))}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-slate-600">{value}★ & above</span>
                </label>
              ))}
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="mt-7 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Price Range</h3>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* APPLY BUTTON */}
          <button
            onClick={handleApplyFilters}
            className="mt-7 w-full h-11 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Apply Filters
          </button>
        </aside>

        {/* PRODUCTS GRID */}
        <section>
          {products.length === 0 ? (
            <div className="min-h-[400px] flex items-center justify-center border border-dashed border-slate-300 rounded-xl">
              <div className="text-center">
                <div className="text-5xl mb-4">🛍️</div>
                <h2 className="text-xl font-bold text-slate-900">No Products Found</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition"
                  >
                    <div className="relative h-64 bg-slate-50 overflow-hidden">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-300"
                      />
                      {product.stock <= 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                      {product.stock > 0 && product.stock <= 5 && (
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Only {product.stock} left
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                        {product.category}
                      </p>
                      <h2 className="mt-1 font-semibold text-slate-900 line-clamp-2 min-h-[48px]">
                        {product.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium text-slate-700">
                          {product.ratings ? product.ratings.toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({product.numberOfReviews || 0})
                        </span>
                      </div>
                      <p className="mt-3 text-xl font-bold text-slate-900">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;