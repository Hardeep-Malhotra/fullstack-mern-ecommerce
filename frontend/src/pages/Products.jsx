import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShoppingBag,
  Star,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  SlidersHorizontal,
  Tag,
  IndianRupee,
} from "lucide-react";
import { getProducts } from "../redux/slices/productSlice";

// Reusable orange-gradient icon badge — matches your existing accent style
const IconBadge = ({ icon: Icon, size = 28 }) => (
  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
    <Icon size={size} />
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (i % 6) * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products = [],
    loading,
    error,
    productCount,
    totalPages,
    currentPage,
  } = useSelector((state) => state.product);

  const urlKeyword = searchParams.get("keyword") || "";
  const urlCategory = searchParams.get("category") || "";

  const [category, setCategory] = useState(urlCategory);
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);

  const [rating, setRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

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

  const buildQueryParams = (page = 1) => {
    const params = { page, keyword: urlKeyword };

    if (category) params.category = category;
    if (rating) params["ratings[gte]"] = rating;
    if (sort) params.sort = sort;

    if (minPrice !== "" && minPrice !== null) {
      params["price[gte]"] = Number(minPrice);
    }
    if (maxPrice !== "" && maxPrice !== null) {
      params["price[lte]"] = Number(maxPrice);
    }

    return params;
  };

  const fetchProducts = (page = 1) => {
    const params = buildQueryParams(page);
    dispatch(getProducts(params));
  };

  useEffect(() => {
    fetchProducts(1);
  }, [urlKeyword, urlCategory]);

  const handleApplyFilters = () => {
    fetchProducts(1);
  };

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

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            <IconBadge icon={AlertTriangle} />
          </motion.div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-red-500">{error}</p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchProducts(1)}
            className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-md shadow-orange-200"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            All Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {urlKeyword
              ? `Search results for "${urlKeyword}"`
              : "Explore our latest products"}
          </p>
          {productCount > 0 && (
            <p className="mt-1 text-xs font-semibold text-orange-600">
              {productCount} products found
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap flex items-center gap-1.5">
            <ArrowUpDown size={14} /> Sort by:
          </label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="h-10 px-3 border border-slate-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 bg-white text-slate-900"
          >
            <option value="">Latest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings">Highest Rated</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* SIDEBAR */}
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 h-fit lg:sticky lg:top-24 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-orange-500" />
              Filters
            </h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600"
            >
              Clear All
            </motion.button>
          </div>

          {/* CATEGORY */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag size={12} /> Category
            </h3>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="radio"
                  name="category"
                  checked={category === ""}
                  onChange={() => handleCategoryChange("")}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
                <span
                  className={`text-sm transition-colors ${category === "" ? "font-semibold text-orange-600" : "text-slate-600 group-hover:text-slate-900"}`}
                >
                  All Categories
                </span>
              </label>

              {categories.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2.5 cursor-pointer group select-none"
                >
                  <input
                    type="radio"
                    name="category"
                    value={item}
                    checked={category === item}
                    onChange={() => handleCategoryChange(item)}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <span
                    className={`text-sm transition-colors ${category === item ? "font-semibold text-orange-600" : "text-slate-600 group-hover:text-slate-900"}`}
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* RATING */}
          <div className="mt-7 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Star size={12} className="fill-amber-400 text-amber-400" /> Rating
            </h3>
            <div className="mt-3 space-y-2">
              {[4, 3, 2, 1].map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2.5 cursor-pointer group select-none"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === String(value)}
                    onChange={() => setRating(String(value))}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <span
                    className={`text-sm flex items-center gap-1 transition-colors ${rating === String(value) ? "font-semibold text-orange-600" : "text-slate-600 group-hover:text-slate-900"}`}
                  >
                    {value}
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    & above
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="mt-7 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <IndianRupee size={12} /> Price Range
            </h3>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-slate-900 placeholder:text-slate-400"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* APPLY BUTTON */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleApplyFilters}
            className="mt-7 w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/20"
          >
            Apply Filters
          </motion.button>
        </motion.aside>

        {/* PRODUCTS GRID / SKELETON */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm p-4"
                >
                  <div className="w-full h-56 bg-slate-200/70 rounded-xl mb-4" />
                  <div className="h-3 bg-slate-200/70 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-slate-200/70 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-slate-200/70 rounded w-1/4 mb-4" />
                  <div className="h-6 bg-slate-200/70 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-slate-200/70 rounded-xl w-full" />
                </motion.div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl"
            >
              <div className="text-center p-6">
                <IconBadge icon={ShoppingBag} />
                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  No Products Found
                </h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                  We couldn't find anything matching your filters. Try adjusting
                  search options.
                </p>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearFilters}
                  className="mt-5 px-5 py-2 rounded-xl bg-orange-100 text-orange-600 text-sm font-bold"
                >
                  Reset All Filters
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {products.map((product, i) => (
                    <motion.div
                      key={product._id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="show"
                      layout
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300/80 transition-shadow duration-300"
                    >
                      <div className="relative h-64 bg-slate-50/50 overflow-hidden flex items-center justify-center p-4">
                        <motion.img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        {product.stock <= 0 && (
                          <span className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            Out of Stock
                          </span>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <span className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">
                          {product.category}
                        </p>
                        <h2 className="mt-1 font-bold text-slate-800 line-clamp-2 min-h-[48px] group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h2>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-slate-700">
                            {product.ratings ? product.ratings.toFixed(1) : "0.0"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            ({product.numberOfReviews || 0})
                          </span>
                        </div>
                        <p className="mt-3 text-xl font-black text-slate-900 tracking-tight">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm"
                        >
                          View Product
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex items-center justify-center gap-2 flex-wrap"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-600 flex items-center gap-1 bg-white"
                  >
                    <ArrowLeft size={14} /> Previous
                  </motion.button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <motion.button
                      key={page}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors duration-200 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
                          : "border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 bg-white"
                      }`}
                    >
                      {page}
                    </motion.button>
                  ))}

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-600 flex items-center gap-1 bg-white"
                  >
                    Next <ArrowRight size={14} />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;